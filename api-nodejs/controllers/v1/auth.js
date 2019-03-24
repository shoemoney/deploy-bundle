const {
	check,
	validationResult
} = require('express-validator/check')
const DB = require('../../core/db')
const { minPWLength } = require('../../core/config')

const tbl = 'USERS'

const rootPost = {}

rootPost.validate = [
	check('login').isLength({
		min: 3
	}).trim().escape(),
	check('password').isLength({
		min: minPWLength
	}).trim().escape(),
]

rootPost.func = async (req, res) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		const {
			login,
			password
		} = req.body
		sql = `SELECT password FROM ${tbl} WHERE username = '${login}' OR email = '${login}'`
		const {
			rowCount,
			rows
		} = await DB.query(sql)
		console.dir(rowCount)
		for (const row in rows) {
			const tmp = rows[row].password.toString('utf-8')
			
		}
	} else {
		console.log('error')
		return res.status(422).json({
			errors: errors.array()
		})
	}}

// EXPORT ROUTES
module.exports = {
	rootPost
}