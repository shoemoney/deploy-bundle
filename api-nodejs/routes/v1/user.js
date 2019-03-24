const expRtr = new require('express-promise-router')()
const {
	NotSupp
} = require('../../controllers/shared/')
const {
	rootGet,
	useridGet,
	useridPut,
	orgidGet,
	orgidPost,
	orgidPut,
} = require('../../controllers/v1/user')

expRtr.route('/')
	.get(rootGet.func)
	.post(NotSupp)
	.put(NotSupp)

	expRtr.route('/00/:userid')
	.get(useridGet.validate, useridGet.func)
	.post(NotSupp)
	.put(useridPut.validate, useridPut.func)

expRtr.route('/:orgid')
	.get(orgidGet.validate, orgidGet.func)
	.post(orgidPost.validate, orgidPost.argon, orgidPost.func)
	.put(orgidPut.validate, orgidPut.func)

// EXPORT ROUTES
module.exports = expRtr