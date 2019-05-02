// Here goes
require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('body', req => JSON.stringify(req.body))

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

let persons = []

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
  response.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot.<br> ${Date()}`)
})

app.post('/api/persons', (request, response) => {
  if(!request.body.name || !request.body.number) {
      response.status(400).send({ error: 'Name or number missing!' })
    }
  if(persons.length > 0 && persons.some(person => person.name === request.body.name)) {
    response.status(400).send({ error: 'Name must be unique!' })
  }
  //const id = Math.round(Math.random() * 100000000)
  const person = new Person({ name: request.body.name, number: request.body.number })
  person.save().then(() => { 
    response.status(201).end()
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT=process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
