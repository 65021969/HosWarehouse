"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { connectSocket, disconnectSocket } from "../../utils/socket";
import axiosInstance from "../../utils/axiosInstance";

const mapStatusToThai = (status) => {
  switch (status) {
    case 'waiting_approval':
      return 'รอการอนุมัติ';
    case 'approved_all':
      return 'อนุมัติทั้งหมด';
    case 'rejected_all':
      return 'ปฏิเสธทั้งหมด';
    case 'approved_partial':
      return 'อนุมัติบางรายการ';
    case 'rejected_partial':
      return 'ปฏิเสธบางรายการ';
    case 'approved_partial_and_rejected_partial': // ✅ เพิ่มสถานะนี้
      return 'อนุมัติและปฏิเสธบางส่วน'; // ✅ คำแปลภาษาไทย
    default:
      return status;
  }
};

export default function ApprovalRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [storage, setStorage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        "/requests?status=waiting_approval,approved_all,rejected_all,approved_partial,rejected_partial,approved_partial_and_rejected_partial" // ✅ เพิ่มสถานะนี้
      );
      setRequests(res.data);
      console.log(res.data);

    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    socket.on("requestUpdated", () => {
      console.log("📡 ได้รับ request ใหม่แบบเรียลไทม์");
      fetchRequests();
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const filteredRequests = requests.filter((item) => {
    return (
      (category === "" || item.category === category) &&
      (unit === "" || item.unit === unit) &&
      (storage === "" || item.storage === storage) &&
      (filter === "" ||
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.department?.toLowerCase().includes(filter.toLowerCase()))
    );
  });

  const currentItems = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredRequests.length)
      setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, category, unit, storage]);

  return (
    <div className={styles.mainHome}>
      <div className={styles.infoContainer}>
        <div className={styles.cardHeader}>
          <h1>ตรวจสอบรายการเบิก ยืม</h1>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="category" className={styles.filterLabel}>หมวดหมู่:</label>
            <select
              id="category"
              className={styles.filterSelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="ยา">ยา</option>
              <option value="เวชภัณฑ์">เวชภัณฑ์</option>
              <option value="ครุภัณฑ์">ครุภัณฑ์</option>
              <option value="อุปกรณ์ทางการแพทย์">อุปกรณ์ทางการแพทย์</option>
              <option value="ของใช้ทั่วไป">ของใช้ทั่วไป</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="unit" className={styles.filterLabel}>หน่วย:</label>
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
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="storage" className={styles.filterLabel}>สถานที่จัดเก็บ:</label>
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
            </select>
          </div>

          <div className={styles.filterGroupSearch}>
            <label htmlFor="filter" className={styles.filterLabel}>ค้นหาข้อมูล:</label>
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

        <div className={`${styles.tableGrid} ${styles.tableHeader}`}>
          <div className={styles.headerItem}>No.</div>
          <div className={styles.headerItem}>วันที่และเวลา</div> {/* รวมวันที่+เวลา */}
          <div className={styles.headerItem}>รหัสคำขอ</div>
          <div className={styles.headerItem}>ผู้ขอเบิก</div>
          <div className={styles.headerItem}>แผนก</div>
          <div className={styles.headerItem}>จำนวนรายการ</div>
          <div className={styles.headerItem}>ประเภท</div>
          <div className={styles.headerItem}>สถานะ</div>
          <div className={styles.headerItem}>ตรวจสอบ</div>
        </div>

        <div className={styles.inventory}>
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : currentItems.length === 0 ? (
            <p>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>
          ) : (
            currentItems.map((item, index) => (
              <div className={`${styles.tableGrid} ${styles.tableRow}`} key={item.request_id}>
                <div className={styles.tableCell}>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </div>
                <div className={styles.tableCell}>
                  {new Date(item.request_date).toLocaleDateString("th-TH")} {" "}
                  {new Date(item.request_date).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className={styles.tableCell}>{item.request_code || "-"}</div>
                <div className={styles.tableCell}>{item.user_name}</div>
                <div className={styles.tableCell}>{item.department}</div>
                <div className={styles.tableCell}>{item.item_count}</div>
                <div className={styles.tableCell}>{item.request_types}</div>
                <div className={styles.tableCell}>{mapStatusToThai(item.request_status)}</div>
                <div className={styles.tableCell}>
                  <Link href={`/manage/approvalRequest/${item.request_id}`}>
                    <button className={styles.actionButton}>รายละเอียด</button>
                  </Link>
                </div>
              </div>

            ))
          )}
        </div>

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
            disabled={currentPage * itemsPerPage >= filteredRequests.length}
          >
            หน้าถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
