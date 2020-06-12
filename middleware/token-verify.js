const jwt = require('jsonwebtoken');
const LogRuntime = require('../Models/LogRuntime');
const IDCHECKER = require('../helper/IDCHECKER');

module.exports =  async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        next(new Error('invalid token!'))
        return false;
    }

    console.log(req.headers['x-api-key'])


    if((req.headers['x-api-key'] !== req.app.get('API_KEY'))){

            if(req.headers['x-api-key'] !== req.app.get('NEW_API_KEY')) {
                next(new Error('invalid key'));
                return false;
            }

    }


    jwt.verify(token, req.app.get('API_KEY'), async (err, decoded) => {
        if (err) {
            next(new Error('invalid token'))
            return false;
        }

        req.decoded = decoded;

        const idPromise = new Promise((resolve, reject) => {
            if(req.method === 'GET') {
                console.log(req.params)
                   resolve(req.params.user_id);
            }else if(req.method === 'POST') {
                   resolve(req.body.user_id);
            }else if(req.method === 'DELETE'){
                   resolve(req.params.user_id)
            }else if(req.method === 'PUT'){
                    resolve(req.body.user_id)
            }
        });
        const user_id = await idPromise
        const _checkJWTID_ = await IDCHECKER(decoded.id, user_id)
        if(!_checkJWTID_) {
            await new LogRuntime({
                data: `${decoded.id} ve ${decoded.phone_number} ile ${user_id}`,
                path: req.url
            }).save();
            console.log(req.app.get('API_KEY'))
            console.log(decoded.id)
            console.log(user_id)
          //  next(new Error('invalid ids'))
            return false;
        }

        next();

    })
};
