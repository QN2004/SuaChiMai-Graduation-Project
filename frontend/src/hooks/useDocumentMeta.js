import { useEffect } from 'react';

const iconSet = (favicon) => {
  const isAdmin = String(favicon).includes('admin');
  return {
    ico: isAdmin ? '/favicon-admin.ico' : '/favicon.ico',
    png: isAdmin ? '/favicon-admin-32.png' : '/favicon-32.png',
    svg: isAdmin ? '/favicon-admin.svg' : '/favicon.svg',
    apple: isAdmin ? '/favicon-admin-48.png' : '/apple-touch-icon.png'
  };
};

const applyIcons = (favicon) => {
  const next = iconSet(favicon);
  const current = document.querySelector("link[rel='icon']");
  if (current?.getAttribute('href') === next.ico) return;

  document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach((node) => {
    node.remove();
  });

  const add = (attrs) => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
    document.head.appendChild(link);
  };

  add({ rel: 'icon', href: next.ico, sizes: 'any' });
  add({ rel: 'shortcut icon', href: next.ico });
  add({ rel: 'icon', type: 'image/png', href: next.png, sizes: '32x32' });
  add({ rel: 'icon', type: 'image/svg+xml', href: next.svg });

  let appleLink = document.querySelector("link[rel='apple-touch-icon']");
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = next.apple;
};

export default function useDocumentMeta({ title, favicon = '/favicon.ico' }) {
  useEffect(() => {
    document.title = title;
    applyIcons(favicon);
  }, [title, favicon]);
};
