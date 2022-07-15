function LyonStatReportsModel(orango) {
    let LyonStatReportsSchema = new orango.Schema({
        date: { type: Date, default: Date.now },
        ma: {type: Number},
        subid: { type: String },
        market: {type: String},
        userCountry: {type: String},
        currencyCode: {type: String},
        searches: { type: Number },
        biddedSearches: { type: Number },
        clicks: { type: Number },
        biddedCTR: { type: String },
        ctr: { type: String },
        split: { type: Number },
        revenue: { type: String },
    })
    orango.model('LyonStatReports', LyonStatReportsSchema)
}
module.exports = {
    LyonStatReportsModel
}