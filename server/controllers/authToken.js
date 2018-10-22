var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

function authToken(req, res, next) {
    // check header/ url parameters or post parameters for token
    var token = null;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        // Authorization: Bearer g1jipjgi1ifjioj
        // Handle token presented as a Bearer token in the Authorization header
        console.log('Found Authorization Bearer token');
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        token = req.headers['x-access-token'];
    }

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // verifies secret and checks exp
    jwt.verify(token, config.salt, function(err, decoded) {      
        if (err) 
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token: '+ err });    
    
        // if everything is good, save to request for use in other routes
        req.userInfo = {id: decoded.id, role: decoded.role};
        next();
    });
    
}

module.exports = authToken;
