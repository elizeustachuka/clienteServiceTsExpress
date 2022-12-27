import express from 'express'
import Cliente from '../models/cliente'
import clientesRepository from '../repositories/clientes-repository'

const clientesRouter = express.Router()

clientesRouter.post('/clientes', (req, res) => {
    const cliente: Cliente = req.body

    clientesRepository.criar(cliente, (id) => {
        if (id) {
            res.status(201).location(`/clientes/${id}`).send()
        } else {
            res.status(400).send()
        }
    })
})

clientesRouter.get('/clientes', (req, res) => {
    clientesRepository.lerTodos((itens) => res.json(itens))
})

clientesRouter.get('/clientes/:id', (req, res) => {
    const id: number = +req.params.id

    clientesRepository.ler(id, (item) => {
        if (item) {
            res.json(item)
        } else {
            res.status(404).send()
        }
    })
})

clientesRouter.put('/clientes/:id', (req, res) => {
    const id: number = +req.params.id

    clientesRepository.atualizar(id, req.body, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

clientesRouter.delete('/clientes/:id', (req, res) => {
    const id: number = +req.params.id

    clientesRepository.apagar(id, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

export default clientesRouter