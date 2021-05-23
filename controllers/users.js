const Users = require('../model/users')
const { HttpCode } = require('../helper/constants')
const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs/promises')
const path = require('path')
require('dotenv').config()
const { promisify } = require('util')
const cloudinary = require('cloudinary').v2
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD,
})

const uploadToCloud = promisify(cloudinary.uploader.upload)

const reg = async (req, res, next) => {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email is already use',
        })
    }
    try {
        const newUser = await Users.create(req.body)
        const { id, name, email, gender, avatar, verifyTokenEmail } = newUser

        /*Hendler of error on email servise */
        try {
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
        } catch (e) {
            // logger
            console.log(e.message)
        }

        try {
            const newUser = await Users.create(req.body)
            return res.status(HttpCode.CREATED).json({
                status: '201 Created',
                ContentType: res.ContentType,
                // code: HttpCode.CREATED,
                user: {
                    email: newUser.email,
                    subscription: newUser.subscription,
                    avatar: newUser.avatarURL,
                },
            })
        } catch (e) {
            next(e)
        }
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)

    if (!user || !isValidPassword || !user.verify) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCode.UNAUTHORIZED,
            message: 'Email or password is wrong',
        })
    }

    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' })

    const newUser = await Users.updateToken(user.id, token)

    return res.status(HttpCode.OK).json({
        status: '200 OK',
        code: HttpCode.OK,
        token: { token },
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        },
    })
}

const logout = async (req, res, next) => {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json({
        Status: '204 No Content'
    })
}

const updateAvatar = async (req, res, next) => {
    const { id } = req.user
    // const avatarUrl = await saveAvatarUser(req)
    // await Users.updateAvatar(id, avatarUrl)
    const { idCloudAvatar, avatarUrl } = await saveAvatarUserToCloud(req)
    await Users.updateAvatar(id, avatarUrl, idCloudAvatar)
    return res.status(HttpCode.OK).json({
        Status: '200 OK',
        ContentType: res.ContentType,
        ResponseBody: {
            avatarUrl
        }
    })
}

const saveAvatarUser = async (req) => {
    const FOLDER_AVATARS = process.env.FOLDER_AVATARS
    const pathFile = req.file.path
    const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`
    const img = await jimp.read(pathFile)
    await img
        .autocrop()
        .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(pathFile)
    try {
        await fs.rename(
            pathFile,
            path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
        )
    } catch (e) {
        console.log(e.message)
    }
    const oldAvatar = req.user.avatar
    if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
        await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
    }
    return path
        .join(FOLDER_AVATARS, newNameAvatar)
        .replace('\\', '/')
}

const saveAvatarUserToCloud = async (req) => {
    try {
        const pathFile = req.file.path
        const {
            public_id: idCloudAvatar,
            secure_url: avatarUrl,
        } = await uploadToCloud(pathFile, {
            public_id: req.user.idCloudAvatar?.replace('Avatars/', ''),
            folder: 'Avatars',
            transformation: { width: 250, height: 250, crop: 'pad' },
        })
        await fs.unlink(pathFile)
        return { idCloudAvatar, avatarUrl }
    } catch (error) {
        console.log(e.message)
    }
}

const verify = async (req, res, next) => {
    try {
        const user = await Users.findByVerifyTokenEmail(req.params.token)
        if (user) {
            await Users.updateVerifyToken(user.id, true, null)
            return res.status(HttpCode.OK).json({
                Status: '200 OK',
                ResponseBody: {
                    message: 'Verification successful',
                },
            })
        }
        return res.status(HttpCode.BAD_REQUEST).json({
            Status: '404 Not Found',
            ResponseBody: {
                message: 'User not found'
            }
        })
    } catch (error) {
        next(error)
    }
}

const repeatEmailVerify = async (req, res, next) => {
    try {
        const user = await Users.findByEmail(req.body.email)
        if (user) {
            const { name, verifyTokenEmail, email } = user
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
            return res.status(HttpCode.OK).json({
                Status: '200 Ok',
                ContentType: 'application/json',
                ResponseBody: {
                    "message": "Verification email sent"
                }
            })
        }
        return res.status(HttpCode.NOT_FOUND).json({
            Status: '400 Bad Request',
            ContentType: 'application/json',
            ResponseBody: {
                "message": "Verification has already been passed"
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    reg,
    login,
    logout,
    updateAvatar,
    saveAvatarUser,
    verify,
    repeatEmailVerify,
}
