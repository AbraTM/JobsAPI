const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors/index')

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if( !authHeader || !authHeader.startsWith("Bearer")){
        throw new UnauthenticatedError("No Token provided")
    }

    const token = authHeader.split(" ")[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_Secret)
        req.user = {userId : payload.userId, name : payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
    }
}

module.exports = authenticationMiddleware