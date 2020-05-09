const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
  ...Base,
  async createRecipe(data) {

    const query = `
      INSERT INTO recipes (
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.user_id
    ]

    const results = await db.query(query, values)
    return results.rows[0].id

  },
  async update(data) {
    const query = `
    UPDATE recipes SET 
      chef_id=($1), 
      title=($2), 
      ingredients=($3), 
      preparation=($4), 
      information=($5)
    WHERE id = $6  
    `

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]

    return db.query(query, values)
  },
  async userRecipes(id) {

    const query = `SELECT recipes.*, chefs.name AS chef_name
    FROM recipes 
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE user_id = $1
    ORDER BY created_at DESC`

    const values = [
      id
    ]

    const results = await db.query(query, values)
    return results.rows
    
  },
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
  file(id) {

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