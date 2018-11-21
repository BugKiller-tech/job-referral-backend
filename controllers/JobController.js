const Job = require('../models/Job');

const CommonResponse  = require('../utils/commonResponse');


module.exports = {
  create: async (req, res) => {
    try {
      const job = await Job.create(req.body);
      if (job) {
        return res.json({
          message: 'Successfully created the job'
        })
      }
      return res.status(400).json({
        message: 'Can not create the job'
      })
    } catch (err) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },
  delete: async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.body._id);
      if (job) {
        return res.json({
          message: 'Successfully deleted the job',
        })
      }
    } catch( err) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }    
  },

  all: async (req, res) => {
    try {
      const jobs = await Job.find({}).sort({ createdAt: -1 });
      return res.json({
        jobs
      })
    } catch ( err ) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },
  latest2000: async(req, res) => {
    try {
      const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(2000);
      return res.json({
        jobs
      })
    } catch ( err ) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }    
  }
}