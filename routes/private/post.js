import express from 'express'
import {verify_token} from '../verifyToken.js'
import User from '../../models/User.js'

export const router = express.Router()

router.get('/', verify_token, async (req, res) => {
    const user = await User.findOne({_id: req.user})
    res.send(user)
})