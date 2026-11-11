export const babyConditions = {
  CMPA: 'Dị ứng đạm sữa bò',
  LACTOSE: 'Bất dung nạp lactose',
  CONSTIPATION: 'Hay táo bón',
  UNDERWEIGHT: 'Nhẹ cân',
  PREMATURE: 'Sinh non'
};

export const cancelReasonText = {
  CUSTOMER: 'Khách hủy',
  STORE: 'Cửa hàng hủy',
  DELIVERY_FAILED: 'Giao thất bại',
  RETURNED: 'Hoàn hàng'
};

export const orderStatusLabel = (order, statusText) =>
  order.order_status === 'CANCELLED' && order.cancel_reason
    ? `${statusText.CANCELLED} – ${cancelReasonText[order.cancel_reason] || ''}`
    : statusText[order.order_status] || order.order_status;
