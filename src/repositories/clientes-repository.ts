import Cliente from '../models/cliente'
import database from './database'

const clientesRepository = {

    criar: (cliente: Cliente, callback: (id?: number) => void) => {
        const sql = 'INSERT INTO clientes (nome, cpf, email, cep, numero, rua, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        
        const params = [cliente.nome, cliente.cpf, cliente.email, cliente.cep, cliente.numero, cliente.rua, cliente.bairro, cliente.cidade, cliente.estado]
       
        database.run(sql, params, function(_err) {
            callback(this?.lastID)
        })
    },

    lerTodos: (callback: (clientes: Cliente[]) => void) => {
        const sql = 'SELECT * FROM clientes'
        const params: any[] = []
        database.all(sql, params, (_err, rows) => callback(rows))
    },

    ler: (id: number, callback: (cliente?: Cliente) => void) => {
        const sql = 'SELECT * FROM clientes WHERE id = ?'
        const params = [id]
        database.get(sql, params, (_err, row) => callback(row))
    },

    atualizar: (id: number, cliente: Cliente, callback: (notFound: boolean) => void) => {
        const sql = 'UPDATE clientes SET nome = ?, cpf = ?, email = ?, cep = ?, numero = ?, rua = ?, bairro = ?, cidade = ?, estado = ? WHERE id = ?'
        const params = [cliente.nome, cliente.cpf, cliente.email, cliente.cep, id]
        database.run(sql, params, function(_err) {
            callback(this.changes === 0)
        })
    },

    apagar: (id: number, callback: (notFound: boolean) => void) => {
        const sql = 'DELETE FROM clientes WHERE id = ?'
        const params = [id]
        database.run(sql, params, function(_err) {
            callback(this.changes === 0)
        })
    },
}

export default clientesRepository