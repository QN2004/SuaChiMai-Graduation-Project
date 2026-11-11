export const formatDate = (value) => (value ? String(value).slice(0, 10).split('-').reverse().join('/') : '');

export const batchStatus = {
  NORMAL: { label: 'Bình thường', tone: 'ok' },
  NEAR_EXPIRY: { label: 'Cận date', tone: 'warn' },
  BLOCKED: { label: 'Ngừng bán online', tone: 'bad' },
  EXPIRED: { label: 'Hết hạn', tone: 'off' }
};

// Sản phẩm tồn bán được = 0 nhưng kho còn lô bị khóa: phân biệt với hết hàng thật.
export const offlineInfo = {
  BLOCKED: {
    label: 'Ngừng bán online',
    note: 'Lô hàng hiện có hạn sử dụng quá ngắn so với thời gian dùng của sản phẩm, cửa hàng tạm ngừng bán online để bé dùng an toàn. Vui lòng liên hệ cửa hàng hoặc chờ lô mới.'
  },
  EXPIRED: {
    label: 'Ngừng bán online',
    note: 'Lô hàng hiện có đã hết hạn sử dụng, cửa hàng đang chờ nhập lô mới.'
  }
};

export const stockLabel = (product) => (Number(product.stock) > 0 ? null : offlineInfo[product.offline_reason]?.label || 'Hết hàng');
