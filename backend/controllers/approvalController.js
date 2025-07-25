const ApprovalModel = require("../models/approvalModel"); // ตรวจสอบว่าเส้นทางถูกต้อง
const { getIO } = require("../socket"); // สำหรับ Socket.IO notification

/**
 * ดึงรายละเอียดคำขอสำหรับหน้าอนุมัติ (ทั้งคำขอหลักและรายการย่อย)
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.getApprovalDetail = async (req, res) => {
  const { request_id } = req.params;
  try {
    const request = await ApprovalModel.getRequestForApproval(request_id);
    if (!request) return res.status(404).json({ error: "ไม่พบคำขอ" });

    const details = await ApprovalModel.getRequestDetails(request_id);
    res.json({ request, details });
  } catch (err) {
    console.error("Error fetching approval detail:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" });
  }
};

exports.bulkUpdateRequestDetails = async (req, res) => {
    const { request_id } = req.params;
    // <<<< แก้ไขตรงนี้: เพิ่ม approved_qty เข้ามาใน destructuring ของ updates
    const { updates, userId } = req.body; // updates: [{ request_detail_id, status, approved_qty, note }]

    try {
        // 1. ตรวจสอบสถานะคำขอหลักก่อนดำเนินการ
        const request = await ApprovalModel.getRequestForApproval(request_id);
        if (!request) return res.status(404).json({ error: "ไม่พบคำขอ" });

        // ป้องกันการแก้ไขคำขอที่เข้าสู่ขั้นตอนการดำเนินการแล้ว
        if (["preparing", "delivering", "completed", "canceled"].includes(request.request_status)) {
            return res.status(400).json({ error: "ไม่สามารถแก้ไขคำขอได้ เนื่องจากอยู่ในสถานะขั้นตอนถัดไป" });
        }

        // 2. วนลูปอัปเดตแต่ละรายการย่อย
        for (const update of updates) {
            // <<<< แก้ไขตรงนี้: เพิ่ม approved_qty เข้ามาใน destructuring ของ update
            const { request_detail_id, status, approved_qty, note } = update; // status คือ 'approved' หรือ 'rejected'

            // <<<< แก้ไขตรงนี้: เพิ่ม approved_qty เข้าไปเป็น parameter ตัวที่ 3
            await ApprovalModel.updateRequestDetailApprovalStatus(request_detail_id, status, approved_qty, userId, note || null);
        }

        // 3. หลังจากอัปเดตรายการย่อยทั้งหมดแล้ว ให้คำนวณและอัปเดตสถานะคำขอหลัก
        await ApprovalModel.updateRequestOverallStatusByDetails(request_id, userId);

        // 4. ส่ง Socket.IO notification
        const io = getIO();
        io.emit("requestUpdated"); // อาจจะส่ง request_id ไปด้วย

        res.json({ message: "บันทึกการอนุมัติ/ปฏิเสธรายการย่อยเรียบร้อยแล้ว" });
    } catch (err) {
        console.error("Error in bulkUpdateRequestDetails:", err);
        res.status(500).json({ error: err.message || "เกิดข้อผิดพลาดในการบันทึก" });
    }
};