"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { CartContext } from "./context/CartContext";
import { toast } from "react-toastify";
// import Link from "next/link";

export default function InventoryWithdraw() {
  const router = useRouter();
  // pop up
  const [actionType, setActionType] = useState(""); // "withdraw" หรือ "borrow"
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [storage, setStorage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // จำนวนรายการที่แสดงต่อหน้า

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleStorageChange = (event) => {
    setStorage(event.target.value);
  };
  // ตัวอย่าง
  const [inputQuantity, setInputQuantity] = useState(1); // ค่าเริ่มต้นคือ 1

  const manageData = [
    {
      id: "1",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
    {
      id: "2",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
        {
      id: "3",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
        {
      id: "4",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
        {
      id: "5",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
            {
      id: "6",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
            {
      id: "7",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
                {
      id: "8",
      image: "https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg", // ลิงก์ของรูปภาพ
      name: "ผ้าผันแผล",
      type: "เวชภัณฑ์",
      quantity: 100,
      unit: "กล่อง",
      status: "พร้อมใช้งาน",
      location: "คลังกลาง",
      dateexd: "30-02-2025",
      edited: "30-02-2025",
      action: "เบิก",
      action2: "ยืม",
    },
  ]

  const currentItems = manageData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < manageData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  //pop up function
  const handleWithdrawClick = (item) => {
    setSelectedItem(item);
    setActionType("withdraw");
    setShowModal(true);
  };

  const handleBorrowClick = (item) => {
    setSelectedItem(item);
    setActionType("borrow");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setActionType("");
  };

  const { addToCart } = useContext(CartContext);

  const handleConfirm = () => {
    if (!inputQuantity || inputQuantity <= 0) {
      toast.error("กรุณากรอกจำนวนให้ถูกต้อง");
      return;
    }
    if (inputQuantity > selectedItem.quantity) {
      toast.error("จำนวนไม่เพียงพอ");
      return;
    }
    console.warn("Missing fields:", selectedItem);
    addToCart({
      id: selectedItem.id,
      image: selectedItem.image,
      name: selectedItem.name,
      quantity: inputQuantity,
      unit: selectedItem.unit,
      type: selectedItem.type,
      location: selectedItem.location,
      action: actionType
    });

    toast.success("เพิ่มรายการเข้าตะกร้าเรียบร้อยแล้ว");
    closeModal();
  };

  return (
    <div className={styles.mainHome}>
      {/* Popup Modal อยู่ตรงนี้ */}
      {showModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              ทำรายการ{actionType === "withdraw" ? "เบิก" : "ยืม"}
            </h2>

            {/* กล่องรวมภาพและรายละเอียด */}
            <div className={styles.modalContentRow}>
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className={styles.modalImage}
              />

              <div className={styles.modalDetails}>
                <div><strong>ชื่อ:</strong> {selectedItem.name}</div>
                <div><strong>รหัสสินค้า:</strong> {selectedItem.id}</div>
                <div><strong>หมวดหมู่:</strong> {selectedItem.type}</div>
                <div><strong>จำนวนคงเหลือ:</strong> {selectedItem.quantity} {selectedItem.unit}</div>
              </div>
            </div>

            {/* แบบฟอร์มกรอกจำนวน */}
            <div className={styles.modalForm}>
              <label htmlFor="quantity">จำนวนที่ต้องการ</label>
              <input
                id="quantity"
                type="number"
                className={styles.modalInput}
                min="1"
                max={selectedItem.quantity}
                value={inputQuantity}
                onChange={(e) => setInputQuantity(Number(e.target.value))}
              />
            </div>

            {/* ปุ่มกด */}
            <div className={styles.modalActions}>
              <button className={styles.modalConfirm} onClick={handleConfirm}>บันทึก</button>
              <button className={styles.modalCancel} onClick={closeModal}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* แถบบน */}
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

      {/* ส่วนของ infoContainer */}
      <div className={styles.infoContainer}>
        {/* ตัวกรอง */}
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <select
              id="category"
              className={styles.filterSelect}
              value={category}
              onChange={handleCategoryChange}>
              <option value="">เลือกหมวดหมู่</option>
              <option value="ยา">ยา</option>
              <option value="เวชภัณฑ์">เวชภัณฑ์</option>
              <option value="ครุภัณฑ์">ครุภัณฑ์</option>
              <option value="อุปกรณ์ทางการแพทย์">อุปกรณ์ทางการแพทย์</option>
              <option value="ของใช้ทั่วไป">ของใช้ทั่วไป</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              id="unit"
              className={styles.filterSelect}
              value={unit}
              onChange={handleUnitChange}>
              <option value="">เลือกหน่วย</option>
              <option value="ขวด">ขวด</option>
              <option value="แผง">แผง</option>
              <option value="ชุด">ชุด</option>
              <option value="ชิ้น">ชิ้น</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              id="storage"
              className={styles.filterSelect}
              value={storage}
              onChange={handleStorageChange}>
              <option value="">เลือกสถานที่จัดเก็บ</option>
              <option value="ห้องเก็บยา">ห้องเก็บยา</option>
              <option value="คลังสินค้า">คลังสินค้า</option>
              <option value="ห้องเวชภัณฑ์">ห้องเวชภัณฑ์</option>
            </select>
          </div>

          {/* ช่องค้นหา */}
          <div className={styles.filterGroupSearch}>
            <input
              type="text"
              id="filter"
              className={styles.filterInput}
              value={filter}
              onChange={handleFilterChange}
              placeholder="กรอกเพื่อค้นหา..."
            />
          </div>
        </div>
        {/* แถบหัวข้อคล้าย Excel */}
        <div className={`${styles.tableGrid} ${styles.tableHeader}`}>
          <div className={styles.headerItem}>หมายเลข</div>
          <div className={styles.headerItem}>รูปภาพ</div>
          <div className={styles.headerItem}>ชื่อ</div>
          <div className={styles.headerItem}>หมวดหมู่</div>
          <div className={styles.headerItem}>จำนวน</div>
          <div className={styles.headerItem}>หน่วย</div>
          <div className={styles.headerItem}>สถานะ</div>
          <div className={styles.headerItem}>สถานที่จัดเก็บ</div>
          <div className={styles.headerItem}>แก้ไขล่าสุด</div>
          <div className={styles.headerItem}>การจัดการ</div>
        </div>

        {/* แสดงข้อมูลในตาราง */}
        <div className={styles.inventory}>
          {currentItems.map((item) => (
            <div className={`${styles.tableGrid} ${styles.tableRow}`} key={item.id}>
              <div className={styles.tableCell}>{item.id}</div>
              <div className={`${styles.tableCell} ${styles.centerCell}`}>
                <img src="https://medthai.com/wp-content/uploads/2016/11/%E0%B8%8B%E0%B8%B5%E0%B8%A1%E0%B8%AD%E0%B8%A5.jpg"
                  alt={item.category}
                  className={styles.imageCell}
                  style={{ width: '70px', height: '70px', objectFit: 'cover' }} // กำหนดขนาดที่นี่} 
                />
              </div>
              <div className={styles.tableCell}>{item.name}</div>
              <div className={styles.tableCell}>{item.type}</div>
              <div className={styles.tableCell}>{item.quantity}</div>
              <div className={styles.tableCell}>{item.unit}</div>
              <div className={styles.tableCell}>{item.status}</div>
              <div className={styles.tableCell}>{item.location}</div>
              <div className={styles.tableCell}>{item.edited}</div>
              <div className={`${styles.tableCell} ${styles.centerCell}`}>
                <button
                  className={`${styles.actionButton} ${styles.withdrawButton}`}
                  onClick={() => handleWithdrawClick(item)}>เบิก</button>

                <button
                  className={`${styles.actionButton} ${styles.borrowButton}`}
                  onClick={() => handleBorrowClick(item)}>ยืม</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          {/* ปุ่มย้อนกลับ */}
          <button
            className={styles.prevButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}>
            หน้าก่อนหน้า
          </button>

          {/* ปุ่มหน้าถัดไป */}
          <button
            className={styles.nextButton}
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= manageData.length}>
            หน้าถัดไป
          </button>
        </div>

      </div>
    </div>
  );
}
