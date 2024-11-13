const express = require('express')
const morgan = require('morgan')

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
  response.json(persons)
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
  if(persons.some(person => person.name === body.name)){
    return response.status(400).json({ 
      error: 'The name must be unique, it is already in the phone book!' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})