const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const recipes = require('../app/controllers/RecipesController')

const { onlyUsers } = require('../app/middlewares/session')
const recipeValidator = require('../app/validators/recipeValidator')



routes.get('/', onlyUsers, recipes.list)
routes.get('/my', onlyUsers, recipes.userRecipes)

routes.get('/create', onlyUsers, recipes.create)
routes.post('/create', onlyUsers, multer.array('photos', 5), recipeValidator.post, recipes.post)

routes.get('/:id', onlyUsers, recipes.show)

routes.get('/:id/edit', onlyUsers, recipes.edit)
routes.put('/:id/edit', onlyUsers, multer.array('photos', 5), recipes.put)

routes.delete('/:id/edit', onlyUsers, multer.array('photos', 5), recipes.delete)

module.exports = routes