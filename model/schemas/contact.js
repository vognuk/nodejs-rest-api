const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema, SchemaTypes } = mongoose

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Enter the name'],
    },
    email: {
        type: String,
        required: [true, 'Email'],
    },
    phone: {
        type: String,
        required: [true, 'Phone'],
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
},
    {
        versionKey: false,
        timestamps: true
    }
);

contactSchema.plugin(mongoosePaginate)
const contacts = mongoose.model('contact', contactSchema)

module.exports = contacts
