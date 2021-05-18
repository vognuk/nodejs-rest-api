const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/users')
const guard = require('../../helper/guard')
const rateLimit = require('express-rate-limit')
const { HttpCode } = require('../../helper/constants')
const uploadAvatar = require('../../helper/upload-avatar')

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 2, // limit each IP to 100 requests per windowMs
    handler: (req, res, next) => {
        return res.status(HttpCode.TO_MANY_REQUESTS).json({
            status: 'Error 429',
            code: HttpCode.TO_MANY_REQUESTS,
            message: 'Too Many Requests. Try again later',
        })
    },
})

router.post('/register', limiter, usersController.reg)
router.post('/login', usersController.login)
router.post('/logout', guard, usersController.logout)
router.patch(
    '/avatars',
    guard,
    uploadAvatar.single('avatar'),
    usersController.updateAvatar,
)

module.exports = router
