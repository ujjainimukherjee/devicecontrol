const express = require('express');
const path = require('path');
const  bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const webpush = require('web-push');
const config = require('./config');
const authToken = require('./controllers/authToken');
const port = process.env.PORT || 5000;
const publicVapidKey = config.wp_public_vapid_key;
const privateVapidKey = config.wp_private_vapid_key;
const app = express();

webpush.setVapidDetails('mailto:c_ujjaini@yahoo.com', publicVapidKey, privateVapidKey);
// enhance your app security with Helmet
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// enable all CORS requests
app.use(cors());
// log HTTP requests
app.use(morgan('combined'));
app.use(require('body-parser').json());

app.use(function(req, res, next) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0");
    next();
});

const deviceRouter = require('./routes/device');
const userRouter = require('./routes/user');
const sessionRouter = require('./routes/session');

app.use('/v1/session', sessionRouter);
app.use('/v1/users', authToken, userRouter);
app.use('/v1/devices', authToken, deviceRouter);

app.post('/v1/listeners', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'HOME DEVICES' });
    webpush.sendNotification( subscription, payload).catch(error => {
        console.error(error.stack);
    });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '/../client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
    });
}
app.listen(port, () => console.log(`Listening on port ${port}`));

