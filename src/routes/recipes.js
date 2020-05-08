const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const recipes = require('../app/controllers/recipesController')

const sessionMiddleware = require('../app/middlewares/session')



routes.get('/', sessionMiddleware.onlyUsers, recipes.list)

routes.get('/create', sessionMiddleware.onlyUsers, recipes.create)
routes.post('/create', sessionMiddleware.onlyUsers, multer.array('photos', 5), recipes.post)

routes.get('/:id', sessionMiddleware.onlyUsers, recipes.show)

routes.get('/:id/edit', sessionMiddleware.onlyUsers, recipes.edit)
routes.put('/:id/edit', sessionMiddleware.onlyUsers, multer.array('photos', 5), recipes.put)

routes.delete('/:id/edit', sessionMiddleware.onlyUsers, multer.array('photos', 5), recipes.delete)

module.exports = routes