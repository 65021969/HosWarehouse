"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { connectSocket, disconnectSocket } from '../../utils/socket';
import Link from "next/link";

export default function InventoryCheck() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [allInventoryItems, setAllInventoryItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const getItemCode = (item) => {
    switch (item.item_category?.toLowerCase()) {
      case "medicine":
        return item.med_code || "-";
      case "medsup":
        return item.medsup_code || "-";
      case "equipment":
        return item.equip_code || "-";
      case "meddevice":
        return item.meddevice_code || "-";
      case "general":
        return item.gen_code || "-";
      default:
        return "-";
    }
  };

  const categoryThaiMap = {
    medicine: "ยา",
    medsup: "เวชภัณฑ์",
    equipment: "ครุภัณฑ์",
    meddevice: "อุปกรณ์ทางการแพทย์",
    general: "ของใช้ทั่วไป",
  };

  useEffect(() => {
    const socket = connectSocket();
    socket.emit('requestInventoryData');
    socket.on('itemsData', (items) => {
      console.log("📦 ได้รับข้อมูลใหม่:", items); // เพิ่ม debug log
      setAllInventoryItems(items); // ✅ อัปเดตทันที
    });
    return () => {
      disconnectSocket();
    };
  }, []);

  const filteredInventory = allInventoryItems.filter((item) => {
    const matchCategory = selectedCategory ? item.item_category === selectedCategory : true;
    const matchUnit = selectedUnit ? item.item_unit === selectedUnit : true;
    const matchStorage = selectedStorage ? item.item_location === selectedStorage : true;
    const matchSearchText = searchText
      ? item.item_name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchCategory && matchUnit && matchStorage && matchSearchText;
  });

  const paginatedItems = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage * ITEMS_PER_PAGE < filteredInventory.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, selectedUnit, selectedStorage]);

  return (
    <div className={styles.mainHome}>
      {/* แถบเมนู */}
      <div className={styles.bar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>ตรวจสอบยอดคงคลัง</li>
          <li className={styles.navItem}>ยา</li>
          <li className={styles.navItem}>เวชภัณฑ์</li>
          <li className={styles.navItem}>ครุภัณฑ์</li>
          <li className={styles.navItem}>อุปกรณ์ทางการแพทย์</li>
          <li className={styles.navItem}>ของใช้ทั่วไป</li>
        </ul>
      </div>

      <div className={styles.infoContainer}>
        {/* ตัวกรอง */}
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="medicine">ยา</option>
              <option value="medsup">เวชภัณฑ์</option>
              <option value="equipment">ครุภัณฑ์</option>
              <option value="meddevice">อุปกรณ์ทางการแพทย์</option>
              <option value="general">ของใช้ทั่วไป</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">เลือกหน่วย</option>
              <option value="ขวด">ขวด</option>
              <option value="แผง">แผง</option>
              <option value="ชุด">ชุด</option>
              <option value="ชิ้น">ชิ้น</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">เลือกสถานที่จัดเก็บ</option>
              <option value="ห้องเก็บยา">ห้องเก็บยา</option>
              <option value="คลังสินค้า">คลังสินค้า</option>
              <option value="ห้องเวชภัณฑ์">ห้องเวชภัณฑ์</option>
            </select>
          </div>

          <div className={styles.filterGroupSearch}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="กรอกเพื่อค้นหา..."
              className={styles.filterInput}
            />
          </div>
        </div>

        {/* หัวตาราง */}
        <div className={`${styles.tableGrid} ${styles.tableHeader}`}>
          <div className={styles.headerItem}>No.</div>
          <div className={styles.headerItem}>รหัส</div>
          <div className={styles.headerItem}>รูปภาพ</div>
          <div className={styles.headerItem}>รายการ</div>
          <div className={styles.headerItem}>หมวดหมู่</div>
          <div className={styles.headerItem}>คงเหลือ</div>
          <div className={styles.headerItem}>หน่วย</div>
          <div className={styles.headerItem}>สถานะ</div>
          <div className={styles.headerItem}>สถานที่จัดเก็บ</div>
          <div className={styles.headerItem}>อัปเดตล่าสุด</div>
          <div className={styles.headerItem}>ดำเนินการ</div>
        </div>

        {/* รายการ */}
        <div className={styles.inventory}>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <div key={item.item_id} className={`${styles.tableGrid} ${styles.tableRow}`}>
                <div className={styles.tableCell}>
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </div>
                <div className={styles.tableCell}>{getItemCode(item)}</div>
                <div className={styles.tableCell}>
                  <img
                    src={item.item_img
                      ? `http://localhost:5000/uploads/${item.item_img}`
                      : "http://localhost:5000/public/defaults/landscape.png"}
                    alt={item.item_name}
                    className={styles.imageCell}
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  />
                </div>
                <div className={styles.tableCell}>{item.item_name}</div>
                <div className={styles.tableCell}>
                  {categoryThaiMap[item.item_category?.toLowerCase()] || item.item_category}
                </div>
                <div className={styles.tableCell}>{item.item_qty}</div>
                <div className={styles.tableCell}>{item.item_unit}</div>
                <div className={styles.tableCell}>พร้อมใช้งาน</div>
                <div className={styles.tableCell}>{item.item_location}</div>
                <div className={styles.tableCell}>
                  {new Date(item.item_update).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className={styles.tableCell}>
                  <Link href={`/manage/inventoryCheck/${item.item_id}/inventoryDetail`} className={styles.actionButton}>
                    ตรวจสอบ
                  </Link>

                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", width: "100%" }}>
              ไม่พบข้อมูลตามเงื่อนไข
            </div>
          )}
        </div>

        {/* ปุ่มเปลี่ยนหน้า */}
        <div className={styles.pagination}>
          <button className={styles.prevButton} onClick={goToPreviousPage} disabled={currentPage === 1}>
            หน้าก่อนหน้า
          </button>
          <button
            className={styles.nextButton}
            onClick={goToNextPage}
            disabled={currentPage * ITEMS_PER_PAGE >= filteredInventory.length}
          >
            หน้าถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
