require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGO_URI

mongoose.set('useCreateIndex', true)

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => { console.log('connected to MongoDB')})
    .catch((error) => { console.log('error connecting to MongoDB: ' + error.message)})

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    number: { type: String, required: true }
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person