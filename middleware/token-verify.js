const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        res.json({
            message: 'invalid token! ' + token,
            status: {
                state: false,
                code: 'JWT0'
            }
        })
        return false;
    }

    jwt.verify(token, req.app.get('API_KEY'), (err, decoded) => {
        if (err) {
            res.json({
                message: 'invalid token!! ' + token,
                status: {
                    state: false,
                    code: 'JWT0'
                }
            });
            return false;
        }

        req.decoded = decoded;
        //console.log('token', decoded);
        next();

    })
};
