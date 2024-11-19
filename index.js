require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('reqInfo', function reqInfo (req) {
  const reqInfo = JSON.stringify(req.body)
  if (reqInfo !== "{}") {
    return reqInfo
  } else {
    return "- No body request"
  }
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqInfo'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "John Cena", 
        "number": "39-11-8352788"
    },
    { 
        "id": 6,
        "name": "Koko Loko", 
        "number": "39-11-0000000"
    }
]

const generateId = () => {
  const personId = persons.length > 0
    ? Math.floor(Math.random()*1000000)
    : 0
  return personId
}

app.get('/', (request, response) => {
  response.send('<h1>Welcome to the Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  const localDateTime = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${localDateTime.toLocaleString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})