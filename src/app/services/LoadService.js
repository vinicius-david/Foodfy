const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')


async function getImage(paramId, req, table) {

  let results = await table.file(paramId)
  const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

  return files[0]
}

async function getImages(paramId, req, table) {

  let results = await table.file(paramId)
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }))

  return files
}

const LoadService = {
  async chef(req) {
    try {

      // get chef
      const { id } = req.params

      let chef = await Chef.findOneWithParam({ where: {id} }, 'recipes', 'chef_id', 'chefs.id')

      // get chef avatar
      chef.img = await getImage(chef.id, req, Chef)

      // get recipes
      results = await Recipe.findAllChefsRecipes(chef.id)
      let recipes = results.rows

      // get recipes images
      const recipesPromise = recipes.map(async recipe => {
  
        recipe.img = await getImage(recipe.id, req, Recipe)
        return recipe
      })
      
      recipes = await Promise.all(recipesPromise)

      return { chef, recipes }
      
    } catch (error) {
      console.error(error)
    }
  },
  async chefs(req) {
    try {

      let chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')

      const chefsPromisse = chefs.map(async chef => {

        chef.img = await getImage(chef.id, req, Chef)
        return chef
      })
      
      chefs = await Promise.all(chefsPromisse)

      return chefs
      
    } catch (error) {
      console.error(error)
    }
  },
  async recipe(req) {
    try {

    const { id } = req.params

    const recipe = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs')

    const files = await getImages(recipe.id, req, Recipe)

    return { recipe, files }

    } catch (error) {
      console.error(error)
    }
  },
  async recipes(req) {
    try {

      let recipes = await Recipe.findAllAs('', 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs', '', 'created_at', 'DESC')
      
      // async function getImage(recipeId) {

      //   let results = await Recipe.file(recipeId)
      //   const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

      //   return files[0]
      // }

      // const recipesPromisse = recipes.map(async recipe => {

      //   recipe.img = await getImage(recipe.id)

      //   return recipe
      // })

      // recipes = await Promise.all(recipesPromisse)

      const recipesPromise = recipes.map(async recipe => {
  
        recipe.img = await getImage(recipe.id, req, Recipe)
        return recipe
      })
      
      recipes = await Promise.all(recipesPromise)

      return recipes

    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = LoadService