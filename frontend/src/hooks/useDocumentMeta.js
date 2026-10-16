import { useEffect } from 'react';

const applyIcons = (favicon) => {
  const isAdmin = favicon.includes('admin');
  const ico = isAdmin ? '/favicon-admin.ico' : '/favicon.ico';
  const png = isAdmin ? '/favicon-admin-32.png' : '/favicon-32.png';
  const svg = isAdmin ? '/favicon-admin.svg' : '/favicon.svg';
  const apple = isAdmin ? '/favicon-admin-48.png' : '/apple-touch-icon.png';
  const bust = `v=${Date.now()}`;

  // Remove old icon links then recreate — Chrome picks up changes more reliably
  document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach((node) => {
    node.remove();
  });

  const add = (attrs) => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
    document.head.appendChild(link);
  };

  add({ rel: 'icon', href: `${ico}?${bust}`, sizes: 'any' });
  add({ rel: 'shortcut icon', href: `${ico}?${bust}` });
  add({ rel: 'icon', type: 'image/png', href: `${png}?${bust}`, sizes: '32x32' });
  add({ rel: 'icon', type: 'image/svg+xml', href: `${svg}?${bust}` });

  let appleLink = document.querySelector("link[rel='apple-touch-icon']");
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = `${apple}?${bust}`;
};

export default function useDocumentMeta({ title, favicon = '/favicon.svg' }) {
  useEffect(() => {
    document.title = title;
    applyIcons(favicon);
  }, [title, favicon]);
}
