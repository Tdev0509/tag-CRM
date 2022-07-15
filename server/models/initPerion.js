const orango = require('orango')
let InitPerionStatReportsSchema = new orango.Schema({
    company_id: { type: String },  
    date: { type: Date, default: Date.now },
    country: {type: String},
    subid: { type: String },  
    impressions: { type: Number },
    monetized_impressions: { type: Number },
    clicks: { type: Number },
    revenue: { type: Number },
    bing_searches_initial: { type: Number },
    bing_searches_followon: { type: Number },
    bing_monetized_searches_initial: { type: Number },
    bing_monetized_searches_followon: { type: Number },
    split: { type: Number },  
    
})

module.exports = {
    InitPerionStatReportsSchema
}