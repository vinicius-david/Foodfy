const express = require('express');
const routes = express.Router();

const users = require('../app/controllers/usersController')

const userValidator = require('../app/validators/userValidator')

const sessionMiddleware = require('../app/middlewares/session')



routes.get('/', sessionMiddleware.onlyUsers, users.list)

routes.get('/create', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins, users.create)
routes.post('/create', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins, users.post)


routes.get('/:id', sessionMiddleware.onlyUsers, users.show)
routes.put('/:id', sessionMiddleware.onlyUsers, userValidator.put, users.put)


routes.get('/:id/edit', sessionMiddleware.onlyAdmins, users.edit)
routes.put('/:id/edit', sessionMiddleware.onlyAdmins, sessionMiddleware.onlyUsers, users.put)

routes.delete('/:id/edit', sessionMiddleware.onlyAdmins, sessionMiddleware.onlyUsers, sessionMiddleware.isYourAccount, users.delete)

module.exports = routes