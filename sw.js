/* Hipposupermarket — Service Worker para avisos con la app cerrada (Web Push) */
const ICONO="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='192'%20height='192'%3E%3Crect%20width='192'%20height='192'%20rx='42'%20fill='%230d9488'/%3E%3Ctext%20x='96'%20y='138'%20font-size='118'%20text-anchor='middle'%3E%F0%9F%9B%92%3C/text%3E%3C/svg%3E";

self.addEventListener("install", (e)=>{ self.skipWaiting(); });
self.addEventListener("activate", (e)=>{ e.waitUntil(self.clients.claim()); });

self.addEventListener("push", (event)=>{
  let data={};
  try{ data = event.data ? event.data.json() : {}; }
  catch(e){ data = { titulo:"Hipposupermarket", mensaje: event.data ? event.data.text() : "" }; }
  const titulo = data.titulo || "Hipposupermarket";
  const opciones = {
    body: data.mensaje || "",
    icon: ICONO,
    badge: ICONO,
    vibrate: [300,150,300,150,400],
    tag: "hippo-notif",
    renotify: true,
    requireInteraction: true,
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener("notificationclick", (event)=>{
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type:"window", includeUncontrolled:true }).then((lista)=>{
      for(const c of lista){ if("focus" in c) return c.focus(); }
      if(self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
