const express = require('express');
const routes = express.Router();

const session = require('../app/controllers/SessionController')

const sessionValidator = require('../app/validators/sessionValidator')

const { isLoggedRedirectToUser } = require('../app/middlewares/session')



routes.get('/login', isLoggedRedirectToUser, session.loginForm)
routes.post('/login', sessionValidator.login, session.login)
routes.post('/logout', session.logout)

routes.get('/forgot-password', session.forgotForm)
routes.post('/forgot-password', sessionValidator.forgot, session.forgot)

routes.get('/reset-password', session.resetForm)
routes.post('/reset-password', sessionValidator.reset, session.reset)

module.exports = routes