// CSCO Mesa de Servicio — Service Worker v2
// Maneja notificaciones push

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) { data = {}; }

  const titulo = data.titulo || '🔔 Nuevo ticket — CSCO';
  const opciones = {
    body: data.cuerpo || 'Se recibió una nueva solicitud de servicio.',
    icon: './icon.jpeg',
    badge: './icon.jpeg',
    tag: 'nuevo-ticket',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || './' }
  };

  e.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data && e.notification.data.url ? e.notification.data.url : './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) {
      if (c.url.includes('Mesa-de-Servicio') && 'focus' in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
