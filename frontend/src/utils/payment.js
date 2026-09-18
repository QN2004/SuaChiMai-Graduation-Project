export const storePayment = {
  bankId: '970436',
  accountNo: '0988888888',
  accountName: 'CHI MAI MILK',
  hotline: '0988 888 888',
  email: 'chimaimilk@gmail.com',
  address: '123 Nguyễn Văn Cừ, P. An Hòa, Q. Ninh Kiều, TP. Cần Thơ',
  website: 'www.chimaimilk.vn'
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
