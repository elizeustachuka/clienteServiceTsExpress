import sqlite3 from 'sqlite3'

const DBSOURCE = 'db.sqlite'
const SQL_CLIENTES_CREATE = `
    CREATE TABLE clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cpf TEXT,
        email TEXT,
        cep TEXT,
        numero INTEGER,
        rua TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT
    )`


const database = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log('Database successfully connected.')
        database.run(SQL_CLIENTES_CREATE, (err) => {
            if (err) {
                // Possivelmente a tabela já foi criada
            } else {
                console.log('Clientes table successfully created.')
            }
        })
    }
})

export default database