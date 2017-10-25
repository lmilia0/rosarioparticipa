
const express = require('express')
const debug = require('debug')
const middlewares = require('lib/api-v2/middlewares')

const app = module.exports = express()

app.post('/',
middlewares.users.restrict,
function votacion (req, res) {
	const numbers = req.body.numbers
	const reg = new RegExp(/^\s*[1-9]\d*(?:\s*,\s*[1-9]\d*)*$/)
	
	if (numbers === undefined || typeof(numbers) !== 'string' || !(reg.test(numbers))) {
		res.status(400)
		res.end()
		return
	}
	res.status(200)
	res.end()
})