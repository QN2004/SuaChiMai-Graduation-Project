export const money = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0));

export const statusText = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao hàng',
  delivered: 'Hoàn thành',
  cancelled: 'Đã hủy',
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao hàng',
  SHIPPED: 'Đang giao hàng',
  COMPLETED: 'Hoàn thành',
  DELIVERED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

export const paymentText = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng'
};

export const paymentStatusText = {
  PAID: 'Đã thanh toán',
  UNPAID: 'Chưa thanh toán'
};

export const orderCode = (order) =>
  order?.order_number || `CM${String(order?.id || 0).padStart(6, '0')}`;

export const statusTone = (status) => {
  const key = String(status || '').toUpperCase();
  if (key === 'COMPLETED' || key === 'DELIVERED') return 'success';
  if (key === 'CANCELLED') return 'danger';
  if (key === 'PENDING' || key === 'SHIPPING' || key === 'SHIPPED') return 'warn';
  return '';
};

export const isProcessingStatus = (status) => {
  const key = String(status || '').toUpperCase();
  return key === 'PENDING' || key === 'CONFIRMED' || key === 'SHIPPING' || key === 'SHIPPED';
};

export const isCompletedStatus = (status) => {
  const key = String(status || '').toUpperCase();
  return key === 'COMPLETED' || key === 'DELIVERED';
};
