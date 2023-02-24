import express from 'express'
import * as dotenv from 'dotenv'

import { v2 as cloudinary } from 'cloudinary'

import Post from '../models/post.js'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({})
        res.status(200).json({ data: posts })
    } catch(err) {
        res.status(500).json({ message: "INTERNAL_ERROR" })   
    }
})

router.post('/', async (req, res) => {
    const { name, prompt, photo } = req.body
    try {
        const photoUrl = await cloudinary.uploader.upload(photo)
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url
        })
        res.status(200).json({ data: newPost })
    } catch(err) {
        res.status(500).json({ message: "INTERNAL_ERROR" })   
    }
})

export default router