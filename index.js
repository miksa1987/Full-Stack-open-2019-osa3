// Here goes
const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('body', req => JSON.stringify(req.body))

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
} ]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person.id)
  if(person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot.<br> ${Date()}`)
})

app.post('/api/persons', (request, response) => {
  if(!request.body.name || !request.body.number) {
      response.status(400).send({ error: 'Name or number missing!' })
    }
  if(persons.some(person => person.name === request.body.name)) {
    response.status(400).send({ error: 'Name must be unique!' })
  }
  const id = Math.round(Math.random() * 100000000)
  const newPerson = { name: request.body.name, number: request.body.number, id: id}
  persons.push(newPerson)

  response.status(201).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT=3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
