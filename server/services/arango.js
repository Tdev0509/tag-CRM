const orango = require('orango')
const { UserModel } = require('../models/user');
const { TagsModel } = require('../models/tags');
const { CompaniesModel } = require('../models/companies');
const { PermissionsModel } = require('../models/permissions');
const { TemplatesModel } = require('../models/templates');
const { LyonStatReportsModel } = require('../models/lyons');
const { PerionStatReportsModel } = require('../models/perions')
const { RubiStatReportsModel } = require('../models/rubies')

const { EVENTS } = orango.consts
const db = orango.get("nextsys")

// we are connected, but orango has not initialized the models
db.events.once(EVENTS.CONNECTED, conn => {
  console.log('🥑  Connected to ArangoDB:', conn.url + '/' + conn.name)
})

// everything is initialized and we are ready to go
db.events.once(EVENTS.READY, () => {
  console.log('🍊  Orango is ready!')
})

async function main() {
  try {
    UserModel(db)
    TagsModel(db)
    CompaniesModel(db)
    PermissionsModel(db)
    TemplatesModel(db)
    LyonStatReportsModel(db)
    PerionStatReportsModel(db)
    RubiStatReportsModel(db)

    await db.connect(
      {
        // url: "https://ab54c1b65c75.arangodb.cloud:8529/",
        // username: "root",
        // password: "QbsK9wBA9SVXFodUG0t7"
        url: "http://localhost:8529",
        username: "root",
        password: "root",
      }
    );
    // everything is initialized and we are ready to go
    console.log('Are we connected?', db.connection.connected) // true
    //db.createCollection("actors")

  } catch (e) {
    console.log(e)
    console.log('Error:', e.message)
  }
}

main()

module.exports = {
  User: db.model('User'),
  Tags: db.model('Tags'),
  Companies: db.model('Companies'),
  Permissions: db.model('Permissions'),
  Templates: db.model('Templates'),
  LyonStatReports: db.model('LyonStatReports'),
  PerionStatReports: db.model('PerionStatReports'),
  RubiStatReports: db.model('RubiStatReports'),
  db,
}