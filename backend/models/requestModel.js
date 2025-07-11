const { pool } = require("../config/db");

// ฟังก์ชันสร้างรหัสคำขอใหม่
const generateRequestCode = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM requests`);
  const count = parseInt(result.rows[0].count || '0') + 1;
  const padded = count.toString().padStart(5, '0');
  return `REQ-${padded}`;
};

// สร้างคำขอใหม่ โดยสถานะเริ่มต้นเป็น 'waiting_approval'
exports.createRequest = async ({ user_id, note, urgent, date, type }) => {
  try {
    const code = await generateRequestCode();

    const result = await pool.query(
      `INSERT INTO requests 
       (request_code, user_id, request_status, request_note, is_urgent, request_due_date, request_date, request_type)
       VALUES ($1, $2, 'waiting_approval', $3, $4, $5, NOW(), $6)
       RETURNING request_id, request_code`,
      [code, user_id, note, urgent, date, type]
    );

    return result.rows[0]; // { request_id, request_code }
  } catch (err) {
    console.error("Error in createRequest:", err);
    throw err;
  }
};

// ดึงคำขอที่ยังรออนุมัติ (status = 'waiting_approval')
exports.getPendingRequests = async (statuses = ['waiting_approval']) => {
  // สร้างพารามิเตอร์แบบ dynamic สำหรับจำนวนสถานะที่ส่งมา
  const params = statuses.map((_, i) => `$${i + 1}`).join(', ');

  const query = `
    SELECT 
      r.request_id,
      r.request_date,
      r.request_status,
      u.user_name,
      u.department,
      STRING_AGG(DISTINCT
        CASE 
          WHEN rd.request_detail_type = 'borrow' THEN 'ยืม'
          WHEN rd.request_detail_type = 'withdraw' THEN 'เบิก'
          ELSE rd.request_detail_type
        END,
        ','
      ) AS request_types,
      COUNT(rd.request_detail_id) AS item_count
    FROM requests r
    JOIN users u ON r.user_id = u.user_id
    LEFT JOIN request_details rd ON r.request_id = rd.request_id
    WHERE r.request_status IN (${params})
    GROUP BY r.request_id, r.request_date, r.request_status, u.user_name, u.department
    ORDER BY r.request_date DESC;
  `;

  const result = await pool.query(query, statuses);
  return result.rows;
};


// เพิ่มรายการคำขอย่อย โดยสถานะเริ่มต้นเป็น 'waiting_approval'
exports.addRequestDetail = async ({ request_id, item_id, quantity, request_detail_type }) => {
  try {
    await pool.query(
      `INSERT INTO request_details (request_id, item_id, requested_qty, request_detail_type, request_detail_status)
       VALUES ($1, $2, $3, $4, 'waiting_approval')`,
      [request_id, item_id, quantity, request_detail_type]
    );
  } catch (err) {
    console.error("Error in addRequestDetail:", err);
    throw err;
  }
};
