import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

const UiFeedbackContext = createContext(null);

let toastId = 0;

export function UiFeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const confirmRef = useRef(null);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((current) => [...current.slice(-4), { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 3200);
  }, [dismissToast]);

  const confirm = useCallback((options) => {
    const config = typeof options === 'string'
      ? { message: options }
      : options || {};

    return new Promise((resolve) => {
      confirmRef.current = resolve;
      setConfirmState({
        title: config.title || 'Xác nhận',
        message: config.message || 'Bạn có chắc muốn thực hiện thao tác này?',
        confirmText: config.confirmText || 'Xác nhận',
        cancelText: config.cancelText || 'Hủy',
        tone: config.tone || 'danger'
      });
    });
  }, []);

  const closeConfirm = useCallback((result) => {
    const resolve = confirmRef.current;
    confirmRef.current = null;
    setConfirmState(null);
    resolve?.(result);
  }, []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <UiFeedbackContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-stack" aria-live="polite" aria-relevant="additions">
          {toasts.map((item) => (
            <div key={item.id} className={`toast-item toast-${item.type}`} role="status">
              <span className="toast-icon">
                {item.type === 'success' && <FaCheckCircle />}
                {item.type === 'error' && <FaTimesCircle />}
                {item.type === 'info' && <FaInfoCircle />}
                {item.type === 'warning' && <FaExclamationTriangle />}
              </span>
              <span className="toast-message">{item.message}</span>
              <button type="button" className="toast-close" onClick={() => dismissToast(item.id)} aria-label="Đóng">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
      {confirmState && createPortal(
        <div className="confirm-backdrop" role="presentation" onClick={() => closeConfirm(false)}>
          <div
            className={`confirm-dialog confirm-${confirmState.tone}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon-wrap">
              <FaExclamationTriangle />
            </div>
            <h3 id="confirm-title">{confirmState.title}</h3>
            <p id="confirm-message">{confirmState.message}</p>
            <div className="confirm-actions">
              <button type="button" className="btn ghost" onClick={() => closeConfirm(false)}>
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                className={`btn ${confirmState.tone === 'danger' ? 'confirm-danger-btn' : 'primary'}`}
                onClick={() => closeConfirm(true)}
                autoFocus
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </UiFeedbackContext.Provider>
  );
}

export function useUiFeedback() {
  const ctx = useContext(UiFeedbackContext);
  if (!ctx) throw new Error('useUiFeedback must be used within UiFeedbackProvider');
  return ctx;
}
