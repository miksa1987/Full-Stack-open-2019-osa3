const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Give password as argument!')
    process.exit(0)
}

const password = process.argv[2]
const url =
  `mongodb+srv://miksaaa666:${password}@cluster0-n1pyl.mongodb.net/persons?retryWrites=true`

  mongoose.connect(url, { useNewUrlParser: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  const Person = mongoose.model('Person', personSchema)

  if(process.argv.length === 3) {
    Person.find( {} )
      .then(result => {
          console.log(result)
          process.exit(0)
      })
  }
  else if(process.argv.length === 5) {
    const person = new Person({name: process.argv[3], number: process.argv[4]})
    person.save().then(response => {
      console.log('Saved!')
      mongoose.connection.close()
      process.exit(0)
    })
  }
  else {
      console.log('Invalid arguments.')
      process.exit(0)
  }