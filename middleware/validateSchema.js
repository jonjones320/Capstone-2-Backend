const Ajv = require("ajv");
const ajv = new Ajv();

const tripNewSchema = require('../schemas/tripNew.json');
const tripUpdateSchema = require('../schemas/tripUpdate.json');
const tripSearchSchema = require('../schemas/tripSearch.json');
const userNewSchema = require('../schemas/userNew.json');
const userUpdateSchema = require('../schemas/userUpdate.json');
const userAuthSchema = require('../schemas/userAuth.json');
const userRegisterSchema = require('../schemas/userRegister.json');
const flightNewSchema = require('../schemas/flightNew.json');
const flightUpdateSchema = require('../schemas/flightUpdate.json');
const flightSearchSchema = require('../schemas/flightSearch.json');


const validateSchema = (schema) => {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    console.log('Validation result:', { 
      valid, 
      errors: validate.errors 
    });

    if (!valid) {
      const errors = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
      return res.status(400).json({ error: `Invalid request data: ${errors}` });
    }
    next();
  };
};

module.exports = {
  validateTripNew: validateSchema(tripNewSchema),
  validateTripUpdate: validateSchema(tripUpdateSchema),
  validateTripSearch: validateSchema(tripSearchSchema),
  validateUserNew: validateSchema(userNewSchema),
  validateUserUpdate: validateSchema(userUpdateSchema),
  validateUserAuth: validateSchema(userAuthSchema),
  validateUserRegister: validateSchema(userRegisterSchema),
  validateFlightNew: validateSchema(flightNewSchema),
  validateFlightUpdate: validateSchema(flightUpdateSchema),
  validateFlightSearch: validateSchema(flightSearchSchema)
};
