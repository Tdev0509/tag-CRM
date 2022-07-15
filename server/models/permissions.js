function PermissionsModel(orango) {
    let PermissionsSchema = new orango.Schema({
        dashboard: { type: Boolean },
        eCommerce: { type: Boolean },
        liveTraffic: { type: Boolean },
        ngBootstrap: { type: Boolean },
        layoutBuilder: { type: Boolean },
        googleMaterial: { type: Boolean },
        protectedMedia: { type: Boolean },
        notifications: { type: Boolean },
        tagManage: { type: Boolean },
        companyManage: { type: Boolean },
        userManage: { type: Boolean },
        reportManage: { type: Boolean },
        role: {type : Number}
    })
    orango.model('Permissions', PermissionsSchema)
}
module.exports = {
    PermissionsModel
}