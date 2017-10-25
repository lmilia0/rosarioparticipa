const express = require('express')
const debug = require('debug')
const middlewares = require('lib/api-v2/middlewares')

const app = module.exports = express()

app.get('/',
middlewares.users.restrict,
function edadUser (req, res) {
	let edad = {
		padron_adulto: Math.random() >= 0.5,
		padron_joven: Math.random() >= 0.5
	}

	if (edad.padron_adulto === true && edad.padron_joven === true)	{
		const k = Math.random() >= 0.5 ? 'padron_adulto' : 'padron_joven'
		edad[k] = false
	}

	res.status(200)
	res.json({edad})
	res.end()
})