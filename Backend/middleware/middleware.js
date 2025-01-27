const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized! Invalid or expired token.' });
        }

        // Attach user ID to request object for further use in the route
        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticateToken;
