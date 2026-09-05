export const ok = (res, message = 'Thanh cong', data = null) =>
  res.json({ success: true, message, data });

export const fail = (res, status = 400, message = 'Co loi xay ra') =>
  res.status(status).json({ success: false, message });
