import { useEffect, useRef, useState } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaHeadset } from 'react-icons/fa';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const QUICK = [
  'Giờ mở cửa?',
  'Địa chỉ cửa hàng?',
  'Nhắn tin nhân viên',
  'Giao hàng khu vực nào?',
  'Sữa cho bé sơ sinh?',
];

function parseMarkdown(text) {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function ChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! 👋 Tôi là trợ lý Sữa Chi Mai. Hỏi tôi về sản phẩm, hoặc nhấn **Nhắn tin nhân viên** để được hỗ trợ trực tiếp!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatState, setChatState] = useState('chat'); // chat, ask_name, ask_contact, ask_message
  const [tempContact, setTempContact] = useState({ full_name: '', phone: '', email: '', message: '' });

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, messages]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { from: 'bot', text }]);
  };

  const startStaffMessaging = () => {
    if (user) {
      setTempContact({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        message: ''
      });
      setChatState('ask_message');
      addBotMessage(`Chào **${user.full_name}**! Bạn muốn nhắn gửi nội dung gì tới nhân viên cửa hàng?`);
    } else {
      setChatState('ask_name');
      addBotMessage('Để nhân viên hỗ trợ tốt nhất, bạn vui lòng nhập **Họ và tên** của mình:');
    }
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    if (!text) setInput('');
    setMessages((prev) => [...prev, { from: 'user', text: msg }]);

    // Trigger staff messaging from normal chat
    if (chatState === 'chat' && (msg.toLowerCase().includes('nhân viên') || msg.toLowerCase().includes('liên hệ') || msg === 'Nhắn tin nhân viên')) {
      startStaffMessaging();
      return;
    }

    // State machine logic
    if (chatState === 'ask_name') {
      setTempContact(prev => ({ ...prev, full_name: msg }));
      setChatState('ask_contact');
      addBotMessage(`Chào **${msg}**! Tiếp theo, bạn vui lòng để lại **Số điện thoại** hoặc **Email** để nhân viên liên hệ lại:`);
      return;
    }

    if (chatState === 'ask_contact') {
      const isEmail = msg.includes('@');
      setTempContact(prev => ({
        ...prev,
        email: isEmail ? msg : prev.email,
        phone: !isEmail ? msg : prev.phone
      }));
      setChatState('ask_message');
      addBotMessage('Cảm ơn bạn. Bây giờ hãy nhập **nội dung** bạn muốn nhắn cho nhân viên:');
      return;
    }

    if (chatState === 'ask_message') {
      const finalContact = { ...tempContact, message: `[Chatbot] ${msg}` };
      setLoading(true);
      try {
        await api.post('/contacts', finalContact);
        addBotMessage('Tuyệt vời! Tin nhắn của bạn đã được gửi tới nhân viên. Chúng tôi sẽ phản hồi sớm nhất qua thông tin bạn đã cung cấp. 😊');
        setChatState('chat');
        setTempContact({ full_name: '', phone: '', email: '', message: '' });
      } catch (err) {
        addBotMessage('Rất tiếc, đã có lỗi khi gửi tin nhắn. Bạn vui lòng gọi hotline **0987 654 321** để được hỗ trợ gấp nhé!');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal bot response
    setLoading(true);
    try {
      const res = await api.post('/chat', { message: msg });
      addBotMessage(res.data.answer);
    } catch {
      addBotMessage('Xin lỗi, tôi gặp chút trục trặc. Bạn có thể gọi hotline **0987 654 321** để được tư vấn nhanh nhất!');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        className="chatbot-trigger"
        aria-label="Mở hộp thoại tư vấn"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FaTimes /> : <FaCommentDots />}
        {!open && <span className="chatbot-badge">Tư vấn</span>}
      </button>

      {open && (
        <div className="chatbot-window" role="dialog" aria-label="Hỗ trợ tư vấn">
          <div className="chatbot-header">
            <span className="chatbot-avatar"><FaRobot /></span>
            <div>
              <strong>Trợ lý Sữa Chi Mai</strong>
              <small>Trả lời tức thì · 7:00–22:00</small>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Đóng"><FaTimes /></button>
          </div>

          <div className="chatbot-body">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${m.from}`}>
                {m.from === 'bot' && <span className="chatbot-msg-avatar"><FaRobot /></span>}
                <div
                  className="chatbot-bubble"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(m.text) }}
                />
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg--bot">
                <span className="chatbot-msg-avatar"><FaRobot /></span>
                <div className="chatbot-bubble chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-quick">
            <button
              className="chatbot-chip"
              style={{ background: '#fff0f5', color: '#d6336c', border: '1px solid #fecdd7' }}
              onClick={() => {
                if (chatState === 'chat') startStaffMessaging();
              }}
            >
              <FaHeadset /> Nhắn tin nhân viên
            </button>
            {QUICK.filter(q => q !== 'Nhắn tin nhân viên').map((q) => (
              <button key={q} className="chatbot-chip" onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <form
            className="chatbot-footer"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={chatState === 'chat' ? "Nhập câu hỏi..." : "Nhập câu trả lời của bạn..."}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Gửi">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
