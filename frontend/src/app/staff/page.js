"use client";
import { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { CartContext } from "./context/CartContext";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Image from "next/image";

export default function InventoryWithdraw() {
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  const socketRef = useRef(null);

  // Modal
  const [actionType, setActionType] = useState(""); // "withdraw" หรือ "borrow"
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputQuantity, setInputQuantity] = useState(1);

  // ตัวกรอง
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [storage, setStorage] = useState("");

  // ข้อมูลทั้งหมดและแบ่งหน้า
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("🟢 Connected to WebSocket server");
      socketRef.current.emit("requestInventoryData");
    });

    socketRef.current.on("itemsData", (items) => {
      // ตรวจสอบข้อมูลที่รับมา กรองค่าที่เป็น null หรือ undefined
      if (Array.isArray(items)) {
        const filteredValidItems = items.filter((item) => item != null);
        setAllItems(filteredValidItems);
      } else {
        setAllItems([]);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔴 Socket disconnected");
      }
    };
  }, []);

  // ฟังก์ชันแสดงรูปภาพ มี fallback รูป default
  function ItemImage({ item_img, alt }) {
    const defaultImg = "http://localhost:5000/public/defaults/landscape.png";

    const [imgSrc, setImgSrc] = useState(
      item_img && typeof item_img === "string" && item_img.trim() !== ""
        ? `http://localhost:5000/uploads/${item_img}`
        : defaultImg
    );

    return (
      <Image
        src={imgSrc}
        alt={alt || "ไม่มีคำอธิบายภาพ"}
        width={70}
        height={70}
        style={{ objectFit: "cover" }}
        onError={() => setImgSrc(defaultImg)}
      />
    );
  }

  // ฟังก์ชันกรองข้อมูล
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (!item) return false; // skip null/undefined

      const matchCategory = category ? item.item_category === category : true;
      const matchUnit = unit ? item.item_unit === unit : true;
      const matchStorage = storage ? item.item_location === storage : true;
      const matchFilterText = filter
        ? item.item_name?.toLowerCase().includes(filter.toLowerCase())
        : true;

      return matchCategory && matchUnit && matchStorage && matchFilterText;
    });
  }, [allItems, category, unit, storage, filter]);

  // แบ่งหน้าจาก filteredItems
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // หน้าเปลี่ยนหน้า
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredItems.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // รีเซ็ตหน้าเมื่อ filter เปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, category, unit, storage]);

  // Modal เปิด-ปิด และจัดการเพิ่มเข้าตะกร้า
  const handleWithdrawClick = (item) => {
    setSelectedItem(item);
    setActionType("withdraw");
    setInputQuantity(1);
    setShowModal(true);
  };

  const handleBorrowClick = (item) => {
    setSelectedItem(item);
    setActionType("borrow");
    setInputQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setActionType("");
  };

  const handleConfirm = () => {
    if (!inputQuantity || inputQuantity <= 0) {
      toast.error("กรุณากรอกจำนวนให้ถูกต้อง");
      return;
    }
    if (!selectedItem) {
      toast.error("ไม่พบข้อมูลสินค้า");
      return;
    }
    if (inputQuantity > selectedItem.item_qty) {
      toast.error("จำนวนไม่เพียงพอ");
      return;
    }
    addToCart({
      id: selectedItem.item_id,
      item_img: selectedItem.item_img
        ? `http://localhost:5000/uploads/${selectedItem.item_img}`
        : "/defaults/landscape.png",
      number: selectedItem.item_number,
      code: getItemCode(selectedItem), // ✅ ใช้ฟังก์ชันนี้
      name: selectedItem.item_name,
      quantity: inputQuantity,
      unit: selectedItem.item_unit,
      type: selectedItem.item_category,
      location: selectedItem.item_location,
      action: actionType,
    });


    toast.success("เพิ่มรายการเข้าตะกร้าเรียบร้อยแล้ว");
    closeModal();
  };

  const getItemCode = (item) => {
    if (!item) return "-";
    switch (item.item_category) {
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
  const translateCategory = (cat) => {
    switch (cat) {
      case "medicine":
        return "ยา";
      case "medsup":
        return "เวชภัณฑ์";
      case "equipment":
        return "ครุภัณฑ์";
      case "meddevice":
        return "อุปกรณ์ทางการแพทย์";
      case "general":
        return "ของใช้ทั่วไป";
      default:
        return cat;
    }
  };
  return (
    <div className={styles.mainHome}>
      {/* Modal */}
      {showModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              ทำรายการ {actionType === "withdraw" ? "เบิก" : "ยืม"}
            </h2>

            <div className={styles.modalContentRow} style={{ display: "flex", gap: "1rem" }}>
              <ItemImage
                item_img={selectedItem.item_img || ""}
                alt={selectedItem.item_name || "ไม่มีชื่อ"}
              />

              <div className={styles.modalDetails}>
                <div>
                  <strong>ชื่อ:</strong> {selectedItem.item_name || "-"}
                </div>
                <div>
                  <strong>รหัสสินค้า:</strong> {selectedItem.item_id || "-"}
                </div>
                <div>
                  <strong>หมวดหมู่:</strong> {translateCategory(selectedItem.item_category) || "-"}
                </div>
                <div>
                  <strong>จำนวนคงเหลือ:</strong> {selectedItem.item_qty || 0}{" "}
                  {selectedItem.item_unit || ""}
                </div>
              </div>
            </div>

            <div className={styles.modalForm}>
              <label htmlFor="quantity">จำนวนที่ต้องการ</label>
              <input
                id="quantity"
                type="number"
                className={styles.modalInput}
                min={1}
                max={selectedItem.item_qty || 1}
                value={inputQuantity}
                onChange={(e) => setInputQuantity(Number(e.target.value))}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalConfirm} onClick={handleConfirm}>
                บันทึก
              </button>
              <button className={styles.modalCancel} onClick={closeModal}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* ตัวกรอง */}
      <div className={styles.infoContainer}>
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <select
              id="category"
              className={styles.filterSelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              id="unit"
              className={styles.filterSelect}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="">เลือกหน่วย</option>
              <option value="ขวด">ขวด</option>
              <option value="แผง">แผง</option>
              <option value="ชุด">ชุด</option>
              <option value="ชิ้น">ชิ้น</option>
              <option value="กล่อง">กล่อง</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              id="storage"
              className={styles.filterSelect}
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
            >
              <option value="">เลือกสถานที่จัดเก็บ</option>
              <option value="ห้องเก็บยา">ห้องเก็บยา</option>
              <option value="คลังสินค้า">คลังสินค้า</option>
              <option value="ห้องเวชภัณฑ์">ห้องเวชภัณฑ์</option>
              <option value="ห้อง1">ห้อง1</option>
              <option value="1">1</option>
            </select>
          </div>

          <div className={styles.filterGroupSearch}>
            <input
              type="text"
              id="filter"
              className={styles.filterInput}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="กรอกเพื่อค้นหา..."
            />
          </div>
        </div>

        {/* ตารางหัวข้อ */}
        <div className={`${styles.tableGrid} ${styles.tableHeader}`}>
          <div className={styles.headerItem}>ลำดับ</div>
          <div className={styles.headerItem}>รหัส</div>
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

        {/* แสดงรายการ */}
        <div className={styles.inventory}>
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((item, index) =>
              item ? (
                <div
                  className={`${styles.tableGrid} ${styles.tableRow}`}
                  key={item.item_id || index}
                >
                  {/* แสดงลำดับ */}
                  <div className={styles.tableCell}>
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </div>
                  {/* แสดงรหัส */}
                  <div className={styles.tableCell}>{getItemCode(item)}</div>
                  <div className={`${styles.tableCell} ${styles.imageCell}`}>
                    <ItemImage
                      item_img={item.item_img || ""}
                      alt={item.item_name || "ไม่มีชื่อ"}
                    />
                  </div>
                  <div className={styles.tableCell}>{item.item_name || "-"}</div>
                  <div className={styles.tableCell}>
                    {translateCategory(item.item_category)}
                  </div>
                  <div className={styles.tableCell}>{item.item_qty || 0}</div>
                  <div className={styles.tableCell}>{item.item_unit || "-"}</div>
                  <div className={styles.tableCell}>{item.item_status || "-"}</div>
                  <div className={styles.tableCell}>{item.item_location || "-"}</div>
                  <div className={styles.tableCell}>
                    {item.item_update
                      ? new Date(item.item_update).toLocaleDateString()
                      : ""}
                  </div>
                  <div className={`${styles.tableCell} ${styles.centerCell}`}>
                    <button
                      className={`${styles.actionButton} ${styles.withdrawButton}`}
                      onClick={() => handleWithdrawClick(item)}
                    >
                      เบิก
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.borrowButton}`}
                      onClick={() => handleBorrowClick(item)}
                    >
                      ยืม
                    </button>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div style={{ padding: "20px", textAlign: "center" }}>ไม่พบข้อมูล</div>
          )}
        </div>

        {/* pagination */}
        <div className={styles.pagination}>
          <button
            className={styles.prevButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            หน้าก่อนหน้า
          </button>
          <button
            className={styles.nextButton}
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= filteredItems.length}
          >
            หน้าถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
