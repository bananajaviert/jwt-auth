import Joi from '@hapi/joi'

const register_validation = data => {
    const schema = Joi.object({
        name: Joi.string().min(8).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
    })

    return schema.validate(data)
}

const login_validation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
    })

    return schema.validate(data)
}

export {register_validation, login_validation}