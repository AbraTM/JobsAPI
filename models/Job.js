const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company : {
        type : String,
        required : [true, "Please provide the company"]
    },
    status : {
        type : String,
        enum : ["interview", "denied", "pending"],
        default : "pending"
    },
    position : {
        type : String,
        required : [true, "Please provide the position"],
        maxlength : 80
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : [true, "Please provide a user"]
    }
}, { timestamps : true })

module.exports = new mongoose.model("Job", JobSchema)