
const express = require('express')
const debug = require('debug')
const middlewares = require('lib/api-v2/middlewares')

const app = module.exports = express()

app.post('/',
middlewares.users.restrict,
function votacion (req, res) {
	console.log(req.body)
	res.status(200)
	res.end()
})