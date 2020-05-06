const db = require('../../config/db')

const { hash } = require('bcryptjs')

const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
  ...Base,
  // async create(data) {
  //   try {

  //   const query = `
  //     INSERT INTO users (
  //       name,
  //       email,
  //       password,
  //       reset_token,
  //       reset_token_expires,
  //       is_admin
  //     ) VALUES ($1, $2, $3, $4, $5, $6)
  //     RETURNING id
  //   `

  //   const passwordHash = await hash(data.password, 8)

  //   const values = [
  //     data.name,
  //     data.email,
  //     passwordHash,
  //     data.reset_token,
  //     data.reset_token_expires,
  //     data.is_admin
  //   ]

  //   const results = await db.query(query, values)

  //   return results.rows[0].id

  //   } catch (err) {
  //     console.error(err)
  //   }
  // },
}