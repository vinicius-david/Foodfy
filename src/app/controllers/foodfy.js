const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
  async index(req, res) {
    try {

      const recipes = await Recipe.findAllAs('', 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs', '', 'created_at', 'DESC')

      return res.render('foodfy/index', { recipes })
      
    } catch (error) {
      console.error(error)
    }
  },
  about(req, res) {
    return res.render('foodfy/about')
  },
  async recipes(req, res) {
    try {

      // get recipes
      let recipes = await Recipe.findAllAs('', 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs', '', 'created_at', 'DESC')

      // get images
      async function getImage(recipeId) {

        let results = await Recipe.files(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

        return files[0]
      }

      const recipesPromisse = recipes.map(async recipe => {

        recipe.img = await getImage(recipe.id)

        return recipe
      })

      recipes = await Promise.all(recipesPromisse)

      return res.render('foodfy/recipes', { recipes })
      
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {

      const { id } = req.params

      const recipe = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'recipes', '', 'created_at', 'DESC')

      if (!recipe) return res.send('Receita não encontrada')

      results = await Recipe.files(recipe.id)
      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }))

      return res.render('foodfy/show', { recipe, files })
      
    } catch (error) {
      console.error(error)
    }
  },
  async chefs(req, res) {
    try {

      let chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')

      async function getImage(chefId) {
  
        let results = await Chef.file(chefId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
  
        return files[0]
      }
  
      const chefsPromisse = chefs.map(async chef => {
  
        chef.img = await getImage(chef.id)
  
        return chef
      })
  
      chefs = await Promise.all(chefsPromisse)
  
      return res.render('foodfy/chefs', { chefs })
      
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
  
        let results = await Recipe.files(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
  
        return files[0]
      }
  
      const recipesPromisse = recipes.map(async recipe => {
  
        recipe.img = await getImage(recipe.id)
  
        return recipe
      })
  
      recipes = await Promise.all(recipesPromisse)
  
      return res.render('foodfy/recipes', { recipes })
      
    } catch (error) {
      console.error(error)
    }
  }
}