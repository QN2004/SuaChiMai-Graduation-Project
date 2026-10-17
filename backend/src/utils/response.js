export const ok = (res, message = 'Thành công', data = null) =>
  res.json({ success: true, message, data });

export const fail = (res, status = 400, message = 'Có lỗi xảy ra') =>
  res.status(status).json({ success: false, message });
