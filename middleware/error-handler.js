const CustomAPIError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message : err.message || "Something went wrong, please try again later"
    }

    if(err.name === "ValidationError"){
        customError.statusCode = 400
        customError.message = Object.values(err.errors).map((item) => item.message).join(", ")
    }

    if(err.code && err.code === 11000){
        customError.statusCode = 400
        customError.message = `Account with email ${err.keyValue.email} already exists.`
    }

    if(err.name === "CastError"){
        customError.statusCode = 404
        customError.message = `No item found with id ${err.value}`
    }

    console.log(err)
    return res.status(customError.statusCode).json(customError.message)
}

module.exports = errorHandlerMiddleware