// by using middleware we are able to use the same login function in so many place.
var jwt = require('jsonwebtoken');
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

const fetchadmin = (req, res, next) => {
    // get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET_ADMIN);
        req.admin = data.admin;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchadmin;
