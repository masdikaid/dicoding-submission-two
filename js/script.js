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