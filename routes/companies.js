var express = require('express');
var router = express.Router();
const { celebrate, Joi } = require('celebrate');

var controller = require('../controllers/CompanyController')
var authenticate = require('../policies/authenticate')

var checkAdmin = require('../policies/checkAdmin');


const createSchema = celebrate({
  body: {
    name: Joi.string().required().error(new Error('Please provide the company name')),
    type: Joi.string().required().error(new Error('Please select the company type')),
    description: Joi.string().required().error(new Error('Please write the company description')),
    size: Joi.number().greater(0).required().error(new Error('Please provide the positive number that represents the size of the company')),
    imageData: Joi.string(),
  }
});

const deleteSchema = celebrate({
  body: {
    _id: Joi.string().required().error(new Error('Please provide the info you want to delete'))
  }
})



router.post('/create', createSchema, controller.create);
router.get('/getAll', controller.getAll);
router.post('/delete', deleteSchema, controller.delete);
router.post('/latest1000', controller.latest1000);




module.exports = router;
