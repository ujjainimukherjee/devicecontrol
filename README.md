# Home Devices

This is an app which helps the user manage all the devices at home like laptops, roku, Amazon echo, etc. The user with **administrative** privileges can **pause** and **unpause** the devices. (S)he can also add a new device. The user with **viewer** privileges can only view the status of the devices.
A demo is available here - **https://managedevice0.herokuapp.com**

# Technologies used

* React for the front end
* Nodejs for the backend
* JWT for authentication token
* web push to show a push notification to the user
* nedb is used as a database

# How to start

* Please clone the project
* To run it type **yarn dev**. The app will run in **localhost:3000**
* When the app loads you can see the login page.
* Also when the app loads, you can see a **push notification**  with the title **HOME DEVICES**, name of the site and a message `Hello World`.
* To see the list of devices, pause/unpause any device or add a new device please login as **adminstrator** with the credentials `parent@home.com/parent`
* To `only` see the list of devices, login as **viewer** with the credentials `child@home.com/child`


# TroubleShooting

* **Web push notification not appearing in Chrome**

You have to change the browser settings so that it allows notofications. By default it is off. Follow the instructions here - https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=en-GB. Basically you have to add a site url to allow notifications. In our case we have to add `localhost:3000`

* **How to change content of web push notification ?**

To change the `title`, go to `server/server.js` and change `title` here
```
const payload = JSON.stringify({ title: 'HOME DEVICES' });
```
To change the `content`, go to `client/public/sw.js` and change the text
```
body: 'Hello, World!'

```

 In order to see the changes you have to do two additional things
 - Unregister the existimng `service worker`. For that open web developer toolbar, go to `Application` tab -> Service Workers'. Find your site and click on `Unregister`
 - Now restart the app using `yarn dev`








