const express = require('express')
const { Pool } = require('pg')
const { generarReporte } = require('../middleware/generarReportes')
require('dotenv').config()

const config = {
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    allowExitOnIdle: true
}

const pool = new Pool(config)

const app = express()

app.listen(3000, console.log('Servidor 3000 conectado'))

app.get('/joyas',generarReporte,async (req, res) => {
    try {
        // Desestructurar la data de query
        const {limits, page, order_by} = req.query
        let consultas = ''

        if(order_by){
            const [ campo, order ] = order_by.split('_')
            consultas += ` ORDER BY ${campo} ${order}`
        }

        if(limits) {
            consultas += ` LIMIT ${limits}`
        }

        if(page && limits) {
            const offset = page*limits - limits // limits*(page - 1) ---> Se calcula desde dónde
            consultas += ` OFFSET ${offset}`
        }

        const query = `SELECT * FROM inventario ${consultas};`

        // const consult = await pool.query(query)
        const {rows: joyas} = await pool.query(query)

        // res.json(data)
        // HATEOAS
        const results = joyas.map(joya => {
            return {
                name: joya.nombre,
                href: `/joyas/joya/${joya.id}`
                }
            })
        
        const totalJoyas = joyas.length

        const stockTotal = joyas.reduce( (acumulador, valorActual) => 
                                    acumulador + valorActual.stock,0)

        const HATEOAS = {
            results,
            totalJoyas,
            stockTotal
        }

        res.json(HATEOAS)

    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/joyas/joya/:id',generarReporte,async (req, res) => {
    try {
        const {id} = req.params
        const query = `SELECT * FROM inventario WHERE id = $1`
        const values = [id]
        const {rows: data} = await pool.query(query, values)
        res.json(data)

    } catch (error) {
        res.status(500).send(error)
    }
})

// Revisar video desde la hora 38 minutos

app.get('/joyas/filtros',generarReporte,async (req, res) => {
    try {
        const {precio_max, precio_min, metal, categoria} = req.query

        let filtros = []
        const values = []

        const agregarFiltro = (campo, comparador, valor) => {
            // cmpo = id; comparador = " = > < "; posicion = 1
            values.push(valor)
            const posicion = filtros.length + 1 // Para eliminar la posición cero

            filtros.push(`${campo} ${comparador} $${posicion}`)
        }

        if (precio_max) {
            agregarFiltro('precio', '<=', precio_max)
        }

        if (precio_min) {
            agregarFiltro('precio', '>=', precio_min)
        }

        if (categoria) {
            agregarFiltro('categoria', '=', categoria)
        }

        if (metal) {
            agregarFiltro('metal', '=', metal)
        }

        // SELECT * FROM inventario WHERE categoria = anillo AND metal = oro;
        const newFilter = filtros.join(' AND ')

        if (precio_max || precio_min || metal || categoria) {
            filtros = `WHERE ${newFilter};`
            const queryConsult = `SELECT * FROM inventario ${filtros}`
            const { rows: data } = await pool.query(queryConsult, values)
            res.json(data)
            // console.log(queryConsult, values)
        } else {
            const queryConsult = 'SELECT * FROM inventario;'
            const { rows: data } = await pool.query(queryConsult, values)
            res.json(data)
        }


    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('*', (_,res) => {
    res.status(404).send('Esta ruta es inválida')
})