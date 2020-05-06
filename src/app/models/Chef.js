const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
  ...Base,
  file(id) {

    const query = `SELECT files.*, chefs.id, file_id
    FROM files
    LEFT JOIN chefs ON (files.id = chefs.file_id)
    WHERE chefs.id = $1`

    const values = [
      id
    ]

    return db.query(query, values)
  },
  allFiles() {

    const query = `SELECT files.*, chefs.id, file_id
    FROM files
    LEFT JOIN chefs ON (files.id = chefs.file_id)`

    return db.query(query)
  }
}