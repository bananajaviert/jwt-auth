import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Routes
import {router as auth_route} from './routes/auth.js'
import {router as post_route} from './routes/private/post.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 8080

// Connect to DB
const uri = process.env.DB_URI
mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
)

const connection = mongoose.connection
connection.once('open', () => {
    console.log('DB Connected')
})

app.use(express.json())

app.use('/api/user', auth_route)
app.use('/api/posts', post_route)

app.listen(port, () => console.log('Server is running'))