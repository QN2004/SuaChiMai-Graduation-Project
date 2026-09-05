import { query } from '../config/db.js';
import { ok } from '../utils/response.js';

export const createContact = async (req, res, next) => {
  try {
    const { full_name, email, phone, message } = req.body;
    if (!full_name?.trim() || !phone?.trim() || !message?.trim()) {
      const error = new Error('Vui lòng nhập đầy đủ họ tên, số điện thoại và nội dung tư vấn');
      error.status = 422;
      throw error;
    }

    const result = await query(
      'INSERT INTO contacts(full_name,email,phone,message,status) VALUES(?,?,?,?,?)',
      [full_name.trim(), email?.trim() || null, phone.trim(), message.trim(), 'new']
    );
    ok(res, 'Gửi liên hệ thành công', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const listContacts = async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        id,
        full_name,
        full_name AS name,
        email,
        phone,
        message,
        status,
        reply_message,
        replied_at,
        created_at
      FROM contacts
      ORDER BY id DESC
    `);
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const allowed = ['new', 'read', 'replied'];
    const { status } = req.body;
    if (!allowed.includes(status)) {
      const error = new Error('Trạng thái liên hệ không hợp lệ');
      error.status = 422;
      throw error;
    }
    await query('UPDATE contacts SET status=? WHERE id=?', [status, req.params.id]);
    ok(res, 'Cập nhật trạng thái liên hệ thành công');
  } catch (err) {
    next(err);
  }
};

export const replyContact = async (req, res, next) => {
  try {
    const { reply_message } = req.body;
    const reply = reply_message?.trim();

    if (!reply) {
      const error = new Error('Vui lòng nhập nội dung phản hồi cho khách hàng');
      error.status = 422;
      throw error;
    }

    const result = await query(
      "UPDATE contacts SET status='replied', reply_message=?, replied_at=NOW() WHERE id=?",
      [reply, req.params.id]
    );

    if (!result.affectedRows) {
      const error = new Error('Không tìm thấy yêu cầu tư vấn');
      error.status = 404;
      throw error;
    }

    ok(res, 'Lưu phản hồi tư vấn thành công');
  } catch (err) {
    next(err);
  }
};
