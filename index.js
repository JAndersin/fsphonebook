const http = require('http')
const express = require('express')
const morgan = require('morgan');
const app = express()

app.use(express.json())


morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))

let persons = [  
    {    
        id: 1,    
        name: "Arto Hellas",    
        number: "040-123456",    
    },
    {    
        id: 2,    
        name: "Ada Lovelace",    
        number: "39-44-5323523",    
    },
    {
        id: 3,    
        name: "Dan Abramov",    
        number: "12-43-234345",    
    },
    {
        id: 4,    
        name: "Mary Poppendick",    
        number: "39-23-6423122",    
    }

]

app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' +persons.length+ ' people</p><p>'+new Date()+'</p>')
})
      
app.get('/api/persons', (req, res) => {
    res.json(persons)
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
          error: 'name missing' 
        })
    } 
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }
    if (persons.some(({name}) => name === body.name)){
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }

    const person = {
        id: Math.floor(1 + Math.random()*(999999)),
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