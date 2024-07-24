require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectDB = require('./db/connect')

//Extra Security Packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit') 

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication')

//Secuirty
app.set('Trust Proxy', 1)
app.use(rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

//MiddleWare
app.use(express.static('./public')) //Public files (HTML, CSS and stuff) files we want to run no matter what.
app.use(express.json()) //Get the body of requests in post methods in json format

//Routes
app.get('/', (req, res) => {
    res.send('Jobs API')
})

app.use('/api/v1', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobsRouter)

//Utility MiddleWare
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
        process.exit(-1)
    }
}

start()