// Here goes
require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('body', req => JSON.stringify(req.body))

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'Name must be unique!' })
  }

  next(error)
}

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({ })
    .then(persons => response.json(persons.map(person => person.toJSON())))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => response.json(person.toJSON()))
    .catch(error => response.status(404).send({ error: 'Cannot find person' }))
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => response.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot.<br> ${Date()}`))
})

app.post('/api/persons', (request, response, next) => {
  if(!request.body.name || !request.body.number) {
    response.status(400).send({ error: 'Name or number missing!' })
  }

  const person = new Person({ name: request.body.name, number: request.body.number })
  person.save().then(() => { 
    response.status(201).end()
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = { name: request.body.name, number: request.body.number }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => response.json(updatedPerson.toJSON()))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(response.status(204).end())
})

app.use(errorHandler)

const PORT=process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
