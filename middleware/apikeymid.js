module.exports = (req, res, next) => {

    const apiKey = req.headers['x-api-key'];

    if(apiKey != req.app.get('API_KEY')){

            res.json({
                message: 'invalid api key!',
                status: {
                    state: false,
                    code: 'IA_0'
                }
            })

    }else{
        next();
    }


}
