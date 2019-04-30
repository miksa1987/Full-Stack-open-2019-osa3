// Here goes
const express = require('express')
const app = express()

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

app.get('/info', (request, response) => {
  response.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot.<br> ${Date()}`)
})

const PORT=3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
