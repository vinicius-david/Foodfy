const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
  ...Base,
  findAllChefsRecipes(id) {

    const query = `SELECT recipes.*, chefs.name AS chef_name
    FROM recipes 
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE chefs.id = $1`
    
    const values = [
      id
    ]
    
    return db.query(query,values)

  },
  findBy(filter) {

    const query = `SELECT recipes.*, chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY updated_at DESC
    `

    return db.query(query)

  },
  files(id) {

    const query = `SELECT files.*, recipe_id, file_id
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_files.recipe_id = $1`

    const values= [
      id
    ]
    return db.query(query, values)
  },
  allFiles() {

    const query = `SELECT files.*, recipe_id, file_id
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    ORDER BY id DESC`

    return db.query(query)
  }
}