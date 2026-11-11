// Thông tin cửa hàng đồng bộ với website (header, footer, trang Liên hệ) và tài liệu của trợ lý Mai (docs/ai).
export const storePayment = {
  bankId: '970436',
  accountNo: '0988888888',
  accountName: 'SUA CHI MAI',
  hotline: '0987 654 321',
  email: 'suachimai.dailoc@gmail.com',
  address: 'Đại Nghĩa, Đại Lộc, Quảng Nam',
  website: 'suachimai.store'
};

export const paymentContent = (orderNumber, fallback = 'SUA CHI MAI') =>
  `${orderNumber || fallback}`.replace(/[^a-zA-Z0-9\s-]/g, '').trim();

export const qrPaymentUrl = ({ amount, orderNumber }) => {
  const params = new URLSearchParams({
    amount: String(Math.round(Number(amount || 0))),
    addInfo: paymentContent(orderNumber),
    accountName: storePayment.accountName
  });

  return `https://img.vietqr.io/image/${storePayment.bankId}-${storePayment.accountNo}-compact2.png?${params}`;
};
