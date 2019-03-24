const Router = require('express-promise-router')
const { NotSupp } = require('../../controllers/shared/')
const { rootGet, cmdPost } = require('../../controllers/dev')

const expRtr = new Router()

expRtr.route('/')
.get(rootGet.func)
.post(NotSupp)
.put(NotSupp)

expRtr.route('/:cmd')
.get(NotSupp)
.post(cmdPost.validate, cmdPost.func)
.put(NotSupp)

module.exports = expRtr