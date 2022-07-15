function RubiStatReportsModel(orango) {
    let RubiStatReportsSchema = new orango.Schema({
        date: { type: Date, default: Date.now },
        publisher: {type: Number},
        subid: { type: String },
        geo: {type: String},
        total_searches: {type: Number},
        monetized_searches: {type: Number},
        clicks: { type: Number },
        revenue: { type: Number },
        split: {type: Number}
    })
    orango.model('RubiStatReports', RubiStatReportsSchema)
}
module.exports = {
    RubiStatReportsModel
}