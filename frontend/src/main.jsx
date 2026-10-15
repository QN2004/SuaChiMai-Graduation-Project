import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { UiFeedbackProvider } from './context/UiFeedbackContext.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#d6336c',
          colorInfo: '#0c6b78',
          borderRadius: 12,
          fontFamily: 'inherit'
        }
      }}
    >
      <BrowserRouter>
        <UiFeedbackProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </UiFeedbackProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
