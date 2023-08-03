const joi = require("joi");

const validationSchema = joi.object({
    username:joi.string().required(),
    password:joi.string().min(3).max(10).required(),
    email:joi.string().email().required(),
});
const validuser = (body) =>{
    return validationSchema.validate(body);
}

module.exports = validuser;