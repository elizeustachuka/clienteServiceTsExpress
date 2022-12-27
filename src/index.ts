import express from 'express'
import cors from 'cors'

import clientesRouter from './routers/clientes-router'

const PORT = process.env.PORT || 4000
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', clientesRouter)

app.use(cors({
    origin:['http://localhost:3000']
}))

app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server start in ${HOSTNAME}:${PORT}`)
})