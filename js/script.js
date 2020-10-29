if ("Notification" in window) {
  permissionHandler();
} else {
  console.error("Browser need for update, cannot show your notification !");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js")
      .catch(function() {
        console.warn("Fail Registered Service Workers !");
      });
  });
} else {
  console.error("Browser need for update, cannot show your notification !");
}

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
  getCompetitionPage();
  navHandler();
});

if (('PushManager' in window)) {
  navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array("BIIfdWdLrx6gS6GSCpBOqmSGyCGHtk2JPbwtVk462QDaZo66tw56EMm_5ShoudSbtOs1WKYsP95IHIUnrybwXuk")
      })
      .then(function(subscribe) {
          console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
          console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('p256dh')))));
          console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('auth')))));
      })
      .catch(function(e) {
          console.error('Tidak dapat melakukan subscribe ', e.message);
      });
  });
};