const orderApiBaseUrl = () => {
  const configured = String(process.env.ORDER_API_URL || '').trim();
  if (configured) return configured.replace(/\/+$/, '');
  return `http://127.0.0.1:${process.env.PORT || 5000}`;
};

export const getMyOrders = async (accessToken) => {
  if (!accessToken) return [];

  const response = await fetch(`${orderApiBaseUrl()}/api/orders/my-orders`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const raw = await response.text();
  let payload;
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const error = new Error(payload.message || `Orders API phản hồi HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return Array.isArray(payload.data) ? payload.data : [];
};
