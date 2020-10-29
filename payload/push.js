const webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BIIfdWdLrx6gS6GSCpBOqmSGyCGHtk2JPbwtVk462QDaZo66tw56EMm_5ShoudSbtOs1WKYsP95IHIUnrybwXuk",
    "privateKey": "qRHeoWAp-9BdURuFtZDieHfiUtXF0FDmqP6iFH8oYbk"
};
 
 
webPush.setVapidDetails(
    'mailto:masdikaid@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/flGgrIRJfLA:APA91bF9ism5lQD74y0n4lMcAls58z8oiQjulhTocYO5nIvhYyHNzkA1GWg6psqbP3PkgkKBEyDBd_4d4vnrHYcKu1t1KuHhnCKqo8OevHRU330GbAHqPrt54lfJOjA86v-Vvoy1JmXr",
    "keys": {
        "p256dh": "BA02hbC/+LtX9i3y/wDxGdx4+Y+kbbPEvKDh9eU5Kt2XaZ36ok2af4ovPVWBa04dnuFRqTZwPsChrYmQCf8sRVE=",
        "auth": "39gewJRgosbkUFKlXh+3gQ=="
    }
};
const payload = 'Halo Socer Maniacs, Pertandingan Madrid FC akan dimulai 5 menit lagi ! Siapkan Kopi mu :)';
const options = {
    gcmAPIKey: '451113071679',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);