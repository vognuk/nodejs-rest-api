const multer = require('multer')
const path = require('path')
require('dotenv').config()

/*
The temporary storage of uploaded files
*/
const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //save file with the original name
    },
})

const upload = multer({
    storage: storage,
    //ограничения для загружаемых файлов
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('image')) {
            // Чтобы принять файл, используется как аргумент `true` таким образом:
            cb(null, true)
            return
        }

        const err = new Error('Загружен не файл изображения!')
        err.status = 400
        cb(err)
        // Чтобы отклонить, прокиньте в аргументы `false` так:
        // cb(null, false)
    },
})

module.exports = upload
