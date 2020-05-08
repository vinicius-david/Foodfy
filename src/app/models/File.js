const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
  ...Base,
  createRelation({recipe_id, file_id}) {

    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      recipe_id,
      file_id
    ]

    return db.query(query, values)

  },
  async deleteRelation(id) {

    try {
      await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])

    } catch (err) {
      console.error(err)
    }
  }
}