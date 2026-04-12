// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBb82N2-5ns7qKjQBAj5UvDW87s2PZ27F0",
    authDomain: "fsa-unilu.firebaseapp.com",
    projectId: "fsa-unilu",
    storageBucket: "fsa-unilu.firebasestorage.app",
    messagingSenderId: "36551990738",
    appId: "1:36551990738:web:e91fdcb53f8aab5d1b7c0b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('Message reçu en arrière-plan:', payload);
    
    const notificationTitle = payload.notification?.title || 'Nouveau paiement';
    const notificationOptions = {
        body: payload.notification?.body || 'Un paiement vient d\'être effectué',
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: {
            url: payload.data?.url || '/',
            click_action: payload.notification?.click_action
        },
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Voir le détail'
            },
            {
                action: 'close',
                title: 'Fermer'
            }
        ]
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestion du clic sur la notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    const action = event.action;
    
    if (action === 'open') {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(windowClients => {
                    // Vérifier si une fenêtre est déjà ouverte
                    for (let client of windowClients) {
                        if (client.url === urlToOpen && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Sinon ouvrir une nouvelle fenêtre
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen);
                    }
                })
        );
    } else {
        // Fermer simplement la notification
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(windowClients => {
                    // Optionnel: focus sur l'application existante
                    if (windowClients.length > 0) {
                        return windowClients[0].focus();
                    }
                })
        );
    }
});
