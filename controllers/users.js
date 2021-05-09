const Users = require('../model/users')
const { HttpCode } = require('../helper/constants')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const reg = async (req, res, next) => {
    const { email } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email in use',
        })
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
            },
        })
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)

    if (!user || !isValidPassword) {
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
        status: '204 No Content'
    })
}

module.exports = {
    reg,
    login,
    logout,
}
