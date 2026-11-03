self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch { data = { title: 'Academy', body: event.data && event.data.text() } }
  const title = data.title || 'Academy'
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    icon: self.registration.scope + 'icon-192.png',
    badge: self.registration.scope + 'icon-192.png',
    data: { link: data.link || '/' },
    vibrate: [80, 40, 80],
  }))
})
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const raw = (event.notification.data && event.notification.data.link) || '/'
  const link = new URL(raw.replace(/^\//, ''), self.registration.scope).href
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ('focus' in c) { c.navigate(link); return c.focus() } }
    return self.clients.openWindow(link)
  }))
})
