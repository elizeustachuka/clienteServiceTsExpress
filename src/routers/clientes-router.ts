import express from 'express'
import Cliente from '../models/cliente'
import clientesRepository from '../repositories/clientes-repository'
import validacep from '../utils/validacep'

const clientesRouter = express.Router()

clientesRouter.post('/clientes', async (req, res) => {

    const cep = req.body.cep
    let responseViaCep

    if(validacep(cep.toString()) !== true) {
        res.status(400).send(`CEP ${cep} invalid format`)
    }

    try {
        const apiResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const responseJson = await apiResponse.json()
        
        responseViaCep = responseJson

        } catch (err) {
            res.status(502).send('Error with ViaCEP Connection')
    }

    let clienteCreate = new Cliente()

    clienteCreate.nome = req.body.nome
    clienteCreate.cpf = req.body.cep
    clienteCreate.email = req.body.email
    clienteCreate.cep = req.body.cep
    clienteCreate.numero = req.body.numero
    clienteCreate.rua = responseViaCep?.logradouro;
    clienteCreate.bairro = responseViaCep?.bairro;
    clienteCreate.cidade = responseViaCep?.localidade;
    clienteCreate.estado = responseViaCep?.uf;

    clientesRepository.criar(clienteCreate, (id) => {

        var responseCliente

        if (id) {
            clientesRepository.ler(id, (cliente) => {
                responseCliente = cliente
                return res.status(201).location(`/clientes/${id}`).send(responseCliente)
            })
        }
    })
})

clientesRouter.get('/clientes', (req, res) => {
    clientesRepository.lerTodos((itens) => res.json(itens))
})

clientesRouter.get('/clientes/viacep/:cep', async (req, res) => {

    const cep: number = +req.params.cep

    if(validacep(cep.toString()) !== true) {
        res.status(400).send(`CEP ${cep} invalid format`)
    }

    try {
        const apiResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const apiResponseJson = await apiResponse.json()
        
        res.send(apiResponseJson)} catch (err) {
            console.log(err)
            res.status(502).send('Error with ViaCEP Connection')
    }
})

clientesRouter.get('/clientes/:id', (req, res) => {
    const id: number = +req.params.id

    clientesRepository.ler(id, (cliente) => {
        if (cliente) {
            res.json(cliente)
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