import express from 'express'
import Cliente from '../models/cliente'
import clientesRepository from '../repositories/clientes-repository'
import validacep from '../utils/validacep'
import { CustomError } from '../models/custom-error-model'
import { HttpCode, HttpCodeMessage } from '../exceptions/AppError'

const clientesRouter = express.Router()

clientesRouter.post('/clientes', async (req, res) => {

    const cep = req.body.cep
    let responseViaCep

    if(validacep(cep.toString()) == false) {
        res.status(400).send(new CustomError(HttpCodeMessage.BAD_REQUEST, HttpCode.BAD_REQUEST, `Invalid format for CEP: ${cep} `))
    }

    if(cep == null) {
        res.status(400).send(new CustomError(HttpCodeMessage.BAD_REQUEST, HttpCode.BAD_REQUEST, `CEP is null`))
    }

    try {
        const apiResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const responseJson = await apiResponse.json()
        
        responseViaCep = responseJson

        } catch {
            res.status(502).send(new CustomError(HttpCodeMessage.BAD_GATEWAY, HttpCode.BAD_GATEWAY, `Error with ViaCEP Connection`))
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

    if(validacep(cep.toString()) == false) {
        res.status(400).send(new CustomError(HttpCodeMessage.BAD_REQUEST, HttpCode.BAD_REQUEST, `CEP is null`))
    }

    try {
        const apiResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const apiResponseJson = await apiResponse.json()
        
        res.send(apiResponseJson)} catch (err) {
            console.log(err)
            res.status(502).send(new CustomError(HttpCodeMessage.BAD_GATEWAY, HttpCode.BAD_GATEWAY, `Error with ViaCEP Connection`))
    }
})

clientesRouter.get('/clientes/:id', (req, res) => {
    const id: number = +req.params.id

    clientesRepository.ler(id, (cliente) => {
        if (cliente) {
            res.json(cliente)
        } else {
            res.status(404).send(new CustomError(HttpCodeMessage.NOT_FOUND, HttpCode.NOT_FOUND, `Cliente with id: ${id} not found`))
        }
    })
})

clientesRouter.put('/clientes/:id', async (req, res) => {
    const id: number = +req.params.id
    const cep: number = +req.body.cep

    let responseViaCep

    if(validacep(cep.toString()) == false) {
        res.status(404).send(new CustomError(HttpCodeMessage.NOT_FOUND, HttpCode.NOT_FOUND, `Cliente with id: ${id} not found`))
    }

    if(cep == null) {
        res.status(400).send(new CustomError(HttpCodeMessage.BAD_REQUEST, HttpCode.BAD_REQUEST, `CEP is null`))
    }

    try {
        const apiResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const responseJson = await apiResponse.json()
        
        responseViaCep = responseJson

        } catch (err) {
            res.status(502).send('Error with ViaCEP Connection')
    }

    let clienteUpdate = new Cliente()

    clienteUpdate.nome = req.body.nome
    clienteUpdate.cpf = req.body.cep
    clienteUpdate.email = req.body.email
    clienteUpdate.cep = req.body.cep
    clienteUpdate.numero = req.body.numero
    clienteUpdate.rua = responseViaCep?.logradouro;
    clienteUpdate.bairro = responseViaCep?.bairro;
    clienteUpdate.cidade = responseViaCep?.localidade;
    clienteUpdate.estado = responseViaCep?.uf;

    clientesRepository.atualizar(id, clienteUpdate, (notFound) => {
        if (notFound) {
            res.status(404).send(new CustomError(HttpCodeMessage.NOT_FOUND, HttpCode.NOT_FOUND, `Cliente with id: ${id} not found`))
        } else {
            res.status(204).send()
        }
    })
})

clientesRouter.delete('/clientes/:id', (req, res) => {
    const id: number = +req.params.id

    clientesRepository.apagar(id, (notFound) => {
        if (notFound) {
            res.status(404).send(new CustomError(HttpCodeMessage.NOT_FOUND, HttpCode.NOT_FOUND, `Cliente with id: ${id} not found`))
        } else {
            res.status(204).send()
        }
    })
})

export default clientesRouter