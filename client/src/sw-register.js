export default function LocalServiceWorkerRegister() {
  const swPath = `${process.env.PUBLIC_URL}/sw.js`;
  const publicVapidKey = "BMi4mXIVwd2YMBj-7C5GH5p_WOnuqKILiDkXV7j8e4msHB7_laeucCRaivuICv2Q_QKmWeAC1pwV0Ts0L8FXQ6I";
  if ("serviceWorker" in navigator) {
    register();
  }
  function register() {
    if ("serviceWorker" in navigator) {
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
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "/"
      });
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: pubKey
      });
      await fetch("/v1/listeners", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json"
        }
      });
    }
  }
}
