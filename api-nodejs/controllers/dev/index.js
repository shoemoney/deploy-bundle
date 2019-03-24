const { check, validationResult } = require('express-validator/check')
const DB = require('../../core/db')

const { MUST_MATCH } = process.env;

const rootGet = {func: async (req, res) => {
	const { rows } = await DB.query(`SELECT * FROM pg_catalog.pg_tables WHERE tablename NOT LIKE 'pg_%' AND tablename NOT LIKE 'sql_%'`)
	res.status(200).json({data: rows})
}}

const cmdPost = {}
cmdPost.validate = [
	check('mustMatch').custom((val) => {
		if (val === MUST_MATCH) {
			return true
		} else {
			throw new Error('Invalid Token')
		}
	}).escape()
]

cmdPost.func = async (req, res) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		const { sql, tables } = req.body
		switch (req.params.cmd) {
			case 'delete':
				for (const one in tables) {
					const _ = await DB.query(`DELETE FROM ${tables[one]}`)
				}
				res.status(200).json({data: 'delete done'})
				break;
			case 'drop':
				for (const one in tables) {
					const _ = await DB.query(`DROP TABLE IF EXISTS ${tables[one]}`)
				}
				res.status(200).json({data: 'drop done'})
				break;
			case 'insert':
				for (const stmnt in sql) {
					console.log(stmnt)
					const _ = await DB.query(sql[stmnt])
				}
				res.status(200).json({data: 'insert done'})
				break;
			default:
				res.status(200).json({data: 'nothing done'})
		}
	} else {
		console.log('error')
		return res.status(422).json({ errors: errors.array() })
	}
}


module.exports = {
	rootGet,
	cmdPost,
}