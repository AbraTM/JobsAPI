const notFoundMiddleware = (req, res) => {
    res.send("<h1>Resource not found</h1>")
}

module.exports = notFoundMiddleware