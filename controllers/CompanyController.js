const Company = require('../models/Company');
const CommonResponse = require('../utils/commonResponse');
const sharp = require('sharp');

module.exports = {
  getAll: async (req, res) => {
    try {
      const companies = await Company.find({}).sort({ createdAt: -1 });
      return res.json({
        companies
      })
    } catch ( err ) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },
  latest1000: async (req, res) => {
    try {
      const companies = await Company.find({}).sort({ createdAt: -1 }).limit(1000);
      return res.json({
        companies
      })
    } catch ( err ) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },

  create: async (req, res) => {
    // name: Joi.string().required().error(new Error('Please provide the company name')),
    // type: Joi.string().required().error(new Error('Please select the company type')),
    // description: Joi.string().required().error(new Error('Please write the company description')),
    // size: Joi.number().greater(0).required().error(new Error('Please provide the positive number that represents the size of the company')),
    // imageData: Joi.string(),
    try {

      // Check if the company that has same name exists already..
      const company = await Company.findOne({ name: req.body.name });
      if (company) {
        return res.status(400).json({
          errors: 'The company that has the same name is already exist'
        })
      }





      let imageUrl = '';
      if (req.body.imageData) {
        const url = '';
        try {
          const result = await sharp(new Buffer(req.body.imageData)).resize(500, 500).toFile(url);
          imageUrl = url;
        } catch (err) {
          return res.status(400).json({
            errors: 'Please provide the valid image data'
          })
        }

        const data = Object.assign({}, req.body);
        if (data.imageData) delete data.imageData;
        data.imageUrl = imageUrl;
        const newCompany = await Company.create(data);
        if (newCompany) {
          return res.json({
            message: 'Successfully created the company'
          })
        }
        return res.status(400).json({
          errors: 'Can not create the company with this info'
        })

      }

    } catch ( err ) {
      console.log('CREATE COMPANY', err);
      return CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },

  updateCompany: async (req, res) => {  // I don't know whether this feature is needed or not. discuss this with ghost009 and will implement if needed!
    
  },

  delete: async (req, res) => {
    try {
      const company = await Company.findByIdAndDelete(req.body._id);
      if (company) {
        return res.json({
          message: 'Successfully deleted the company',
        })
      }
    } catch( err) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  }

}