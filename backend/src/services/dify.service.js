const normalizeBaseUrl = (value) => String(value || 'http://host.docker.internal/v1').replace(/\/+$/, '');

const difyConfig = () => ({
  baseUrl: normalizeBaseUrl(process.env.DIFY_API_URL),
  apiKey: process.env.DIFY_API_KEY,
  timeout: Math.max(5000, Number(process.env.DIFY_TIMEOUT_MS) || 120000)
});

const requestDify = async (path, options = {}) => {
  const { baseUrl, apiKey, timeout } = difyConfig();
  if (!apiKey) {
    const error = new Error('Chatbot chưa được cấu hình DIFY_API_KEY');
    error.status = 503;
    throw error;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...options.headers
      }
    });
    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { message: raw };
    }
    if (!response.ok) {
      const error = new Error(data.message || data.error || `Dify phản hồi HTTP ${response.status}`);
      error.status = response.status;
      error.details = data;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Dify phản hồi quá thời gian chờ');
      timeoutError.status = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export const uploadFileToDify = async (file, user) => {
  if (!file) return null;
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('user', user);
  return requestDify('/files/upload', { method: 'POST', body: form });
};

export const sendChatMessage = async ({ query, conversationId, user, accessToken, file }) => {
  const uploaded = await uploadFileToDify(file, user);
  const inputs = {};
  if (accessToken) inputs.access_token = accessToken;

  const payload = {
    inputs,
    query,
    response_mode: 'blocking',
    conversation_id: conversationId || '',
    user,
    auto_generate_name: true
  };
  if (uploaded?.id) {
    payload.files = [{
      type: 'image',
      transfer_method: 'local_file',
      upload_file_id: uploaded.id
    }];
  }

  return requestDify('/chat-messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

export const getSuggestedQuestions = async ({ messageId, user }) => {
  if (!messageId) return [];
  try {
    const data = await requestDify(`/messages/${encodeURIComponent(messageId)}/suggested?user=${encodeURIComponent(user)}`);
    return Array.isArray(data.data) ? data.data.slice(0, 4) : [];
  } catch {
    return [];
  }
};
