const db = require('../models')
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    // get from cookie
    try {
        const token = req.cookies.JWT;
        if (token) {
            const verify = await jwt.verify(token, 'tokensecret', (err, decoded) => {
                if (decoded) {
                    res.locals.user_id = decoded.user_id
                    next();
                } else {
                    console.log(err);
                }
            });
        } else
            res.redirect('/signin');
    } catch (error) {
        console.log(error);
    }
};

module.exports = { auth } 