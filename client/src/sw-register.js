export default function LocalServiceWorkerRegister() {
  const swPath = `${process.env.PUBLIC_URL}/sw.js`;
  const publicVapidKey = "BMi4mXIVwd2YMBj-7C5GH5p_WOnuqKILiDkXV7j8e4msHB7_laeucCRaivuICv2Q_QKmWeAC1pwV0Ts0L8FXQ6I";
  // if ("serviceWorker" in navigator && process.env.NODE_ENV !== "production") {
  //   register();
  // }
  if ("serviceWorker" in navigator) {
    register();
  }
  function register() {
    if ("serviceWorker" in navigator) {
      console.log("Registering service worker");
      run().catch(error => console.error(error));
    }
    async function run() {
      function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, "+")
          .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
      const pubKey = urlBase64ToUint8Array(publicVapidKey);
      console.log("Registering service worker again");
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "/"
      });
      console.log("Registered service worker 2");

      console.log("Registering push");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // The `urlBase64ToUint8Array()` function is the same as in
        // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
        applicationServerKey: pubKey
      });
      console.log("Registered push");

      console.log("Sending push");
      await fetch("/v1/listeners", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json"
        }
      });
      console.log("Sent push");
    }
  }
}
