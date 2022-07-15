function CompaniesModel(orango) {
    let CompaniesSchema = new orango.Schema({
      name: { type: String },
      reportingProviders: [],
      adServerUrls: [],
      created: { type: Date, default: Date.now },
      released: Date,
    })
    orango.model('Companies', CompaniesSchema)
  }
  module.exports = {
    CompaniesModel
  }