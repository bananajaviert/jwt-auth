import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import {register_validation, login_validation} from '../validation.js'

const router = express.Router()


router.post('/register', async (req, res) => {
    const {error} = register_validation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // if user already exists
    const email_exists = await User.findOne({email: req.body.email})
    if(email_exists) return res.status(400).send('Email already exists')

    const salt = await bcrypt.genSalt(10)
    const hashed_password = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed_password
    })
    try {
        const save_user = await user.save()
        res.send({user: save_user._id})
    } catch(err) {
        res.status(400).send(`Error: ${err}`)
    }
})

router.post('/login', async (req, res) => {
    const {error} = login_validation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // if email doesn't exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email does not exists')

    // Check if password match
    const verify_password = await bcrypt.compare(req.body.password, user.password)
    if(!verify_password) return res.status(400).send('Invalid password')

    //Create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY)
    res.header('auth-token', token).send(token)
})

export {router}