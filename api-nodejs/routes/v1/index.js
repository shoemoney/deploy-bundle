
// EXPORT
module.exports = (app) => {
	// USE ROUTES
	app.use('/users', require('./user'))
	app.use('/auth', require('./auth'))
}