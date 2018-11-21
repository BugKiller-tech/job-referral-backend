var express = require('express');
var router = express.Router();
const { celebrate, Joi } = require('celebrate');
var controller = require('../controllers/JobController')
var authenticate = require('../policies/authenticate')
var checkAdmin = require('../policies/checkAdmin')


const createSchema = celebrate({
  body: {
    name: Joi.string().required().error(new Error('Please provide the name')),
    description: Joi.string().required().error(new Error('Please provide the job description [description]')),
  }
})

const deleteSchema = celebrate({
  body: {
    _id: Joi.string().required().error(new Error('Please select the job you want to delete [_id]'))
  }
})



router.post('/create', createSchema, controller.create);
router.post('/delete', deleteSchema, controller.delete);
router.post('/all', controller.all);
router.post('/latest2000', controller.latest2000);

module.exports = router;
