function TemplatesModel(orango) {
    let TemplateSchema = new orango.Schema({
        templateName: { type: String },
        name: { type: String },
        company: { type: String },
        advertiser: { type: String },
        publisher: { type: String },
        browserStatus: { type: String },
        browser: [],
        deviceTypeStatus: { type: String },
        deviceType: [],
        versionStatus: { type: String },
        version: [],
        countryStatus: { type: String },
        adServerUrl: {type: String},
        statType: {type: String},
        subids: [],
        rotationType: {type: String},
        url: {type: String},
        params: [],
        created: { type: Date, default: Date.now },
        released: Date,
    })
    orango.model('Templates', TemplateSchema)
  }
module.exports = {
    TemplatesModel
}