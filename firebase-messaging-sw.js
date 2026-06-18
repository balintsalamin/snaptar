// firebase-messaging-sw.js
// Ez a fájl a Push értesítések fogadásáért felelős, amikor az oldal NINCS aktív előtérben.
// Fontos: az alábbi firebaseConfig megegyezik az index.html-ben lévővel.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAhlTRmPc1256mjbs5q7JlirNNVEDj9vbo",
  authDomain: "snaptar-d988d.firebaseapp.com",
  projectId: "snaptar-d988d",
  storageBucket: "snaptar-d988d.firebasestorage.app",
  messagingSenderId: "617829119177",
  appId: "1:617829119177:web:aed7aa4282feb12e680918"
});

const messaging = firebase.messaging();

// Háttérben érkező FCM üzenetek (oldal nincs aktívan megnyitva)
messaging.onBackgroundMessage(function(payload) {
  const n = payload.notification || {};
  const title = n.title || 'Gyerekvigyázás';
  const body = n.body || '';
  self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-72.png',
    tag: payload.data && payload.data.tag ? payload.data.tag : 'vigyazas',
    renotify: true,
    data: { url: self.location.origin + self.registration.scope }
  });
});

// Értesítésre kattintáskor nyissa meg az oldalt
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : self.location.origin + self.registration.scope;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
