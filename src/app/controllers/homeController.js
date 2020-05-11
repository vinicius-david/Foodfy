const Recipe = require('../models/Recipe')
const User = require('../models/User')
const LoadService = require('../services/LoadService')

module.exports = {
  async index(req, res) {
    try {

      const recipes = await LoadService.recipes(req)

      return res.render('home/index', { recipes, number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }
  },
  about(req, res) {
    return res.render('home/about', { number: Math.ceil(Math.random() * 20) })
  },
  async recipes(req, res) {
    try {

      // pagination
      let { page, limit } = req.query
      let filter = ''
      let pages = []

      const allRecipes = await LoadService.recipes(req)
      const totalRecipes = allRecipes.length

      page = page || 1
      limit = limit || 6
      let offset = limit * ( page - 1 )

      for (let i = 1; i <= Math.ceil(totalRecipes/limit); i++) {
        pages.push(i)
      }

      // get recipes
      results = await Recipe.findBy(filter, limit, offset)
      let recipes = results.rows
  
      // get images
      async function getImage(recipeId) {
  
        let results = await Recipe.file(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
  
        return files[0]
      }
  
      const recipesPromisse = recipes.map(async recipe => {
  
        recipe.img = await getImage(recipe.id)
  
        return recipe
      })
  
      recipes = await Promise.all(recipesPromisse)
  
      return res.render('home/recipes', { 
        recipes,  
        number: Math.ceil(Math.random() * 20),
        pages
      })
      
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {

      const { recipe, files } = await LoadService.recipe(req)

      if (!recipe) return res.send('Receita não encontrada')

      return res.render('home/show', { recipe, files, number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }
  },
  async chefs(req, res) {
    try {

      const chefs = await LoadService.chefs(req)
  
      return res.render('home/chefs', { chefs, number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }    
  },
  async filter(req, res) {
    try {

      // pagination
      let { filter, page, limit } = req.query
      let pages = []

      let results = await Recipe.findBy(filter)
      const totalRecipes = results.rows.length

      page = page || 1
      limit = limit || 6
      let offset = limit * ( page - 1 )

      for (let i = 1; i <= Math.ceil(totalRecipes/limit); i++) {
        pages.push(i)
      }

      // get recipes
      results = await Recipe.findBy(filter, limit, offset)
      let recipes = results.rows
  
      // get images
      async function getImage(recipeId) {
  
        let results = await Recipe.file(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
  
        return files[0]
      }
  
      const recipesPromisse = recipes.map(async recipe => {
  
        recipe.img = await getImage(recipe.id)
  
        return recipe
      })
  
      recipes = await Promise.all(recipesPromisse)
  
      return res.render('home/filter', { 
        recipes, 
        filter, 
        number: Math.ceil(Math.random() * 20),
        pages
      })
      
    } catch (error) {
      console.error(error)
    }
  },
  async admin(req,res) {
    try {

      const recipes = await LoadService.recipes(req)
      const chefs = await LoadService.chefs(req)
      const users = await User.findAll()

      return res.render('admin/index', {
        recipes: recipes.length,
        chefs: chefs.length,
        users: users.length,
        number: Math.ceil(Math.random() * 20)
      })
      
    } catch (error) {
      console.error(error)
    }
  }
}