const Recipe = require('../models/Recipe')
const LoadService = require('../services/LoadService')

module.exports = {
  async index(req, res) {
    try {

      const recipes = await LoadService.recipes(req)

      return res.render('home/index', { recipes })
      
    } catch (error) {
      console.error(error)
    }
  },
  about(req, res) {
    return res.render('home/about')
  },
  async recipes(req, res) {
    try {
  
      const recipes = await LoadService.recipes(req)

      return res.render('home/recipes', { recipes })
      
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {

      const { recipe, files } = await LoadService.recipe(req)

      if (!recipe) return res.send('Receita não encontrada')

      return res.render('home/show', { recipe, files })
      
    } catch (error) {
      console.error(error)
    }
  },
  async chefs(req, res) {
    try {

      const chefs = await LoadService.chefs(req)
  
      return res.render('home/chefs', { chefs })
      
    } catch (error) {
      console.error(error)
    }    
  },
  async filter(req, res) {
    try {

      const { filter } = req.query

      // get recipes
      let results = await Recipe.findBy(filter)
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
  
      return res.render('home/filter', { recipes, filter })
      
    } catch (error) {
      console.error(error)
    }
  },
  admin(req,res) {
    return res.render('admin/index')
  }
}