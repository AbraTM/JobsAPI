const Job = require('../models/Job')
const { NotFoundError, BadRequestError } = require("../errors/index")
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async(req, res) => {
    const allJobs = await Job.find({createdBy : req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({ allJobs })
}

const getJob = async(req, res) => {
    const {user : {userId}, params : {id:jobId}} = req
    const job = await Job.find({
        _id : jobId,
        createdBy : userId
    })

    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }
    return res.status(StatusCodes.OK).json({ job })
}

const createJob = async(req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create({...req.body})
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async(req, res) => {
    const {
        user : {userId}, 
        params : {id:jobId},
        body : {company, postion}
    } = req

    if(company === "" || postion === ""){
        throw new BadRequestError("Company or Position can't be empty.")
    }

    const job = await Job.findByIdAndUpdate({_id : jobId, createdBy: userId}, req.body, {new : true, runValidators : true})

    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }

    return res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const {
      user: { userId },
      params: { id: jobId },
    } = req
  
    const job = await Job.findByIdAndDelete({
      _id: jobId,
      createdBy: userId,
    })
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
  }

// const deleteJob = async (req, res) => {
    
//     const { user : { userId }, parmas : { id : jobId }} = req
//     console.log("Hello" + " "  + "World")
//     const job = await Job.findByIdAndRemove({_id : jobId , createdBy : userId})

//     if(!job){
//         throw new BadRequestError(`No job with the id ${jobId}`)
//     }
//     console.log(JSON.stringify(job))
//     res.status(StatusCodes.OK).json({msg  : "Succesfully Deleted Job"})
// }

// const deleteJob = async (req, res) => {
//     const {
//       user: { userId },
//       params: { id: jobId },
//     } = req
  
//     const job = await Job.findByIdAndRemove({
//       _id: jobId,
//       createdBy: userId,
//     })
//     if (!job) {
//       throw new NotFoundError(`No job with id ${jobId}`)
//     }
//     res.status(StatusCodes.OK).send()
// }

module.exports = { 
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}