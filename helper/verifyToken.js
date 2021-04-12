const jwt = require('jsonwebtoken')
const formResponse = require('./formResponse')

const verifyToken = (req, res, next) => {
    const token = req.header('user-token')

    if(!token){
        formResponse({
            message: 'Resource Not Found',
            status: 404
        }, res)
    }else{
        const newToken = token.split(" ")[1]
        jwt.verify(newToken, process.env.SECRET_KEY, function (err, decoded) {
            if(!err){ 
                // console.log('id' + req.query.id)
                // console.log('decoded' + decoded.userId)
                if(decoded.role == 'admin') next()
                else if(decoded.role == 'superadmin') next()
                else if(decoded.user_id == req.query.id){ next()
                }else formResponse({
                    message: 'Forbidden',
                    status: 403
                }, res)
            }else{
                formResponse({
                    message: err.message,
                    status: 400
                }, res)
            }
        });
    }
}

module.exports = verifyToken