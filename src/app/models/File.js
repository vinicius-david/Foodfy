const db = require('../../config/db')
const fs = require('fs')

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
  async delete(id) {

    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(`${file.path}`)

      await db.query(`
                DELETE FROM recipe_files WHERE file_id = $1
            `, [id])
      await db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])

    } catch (err) {
      console.error(err)
    }
  },
  async deleteChefFile(id) {

    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(`public${file.path}`)
      
      await db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])

    } catch (err) {
      console.error(err)
    }
  }
}