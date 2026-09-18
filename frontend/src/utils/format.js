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
