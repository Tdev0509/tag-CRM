function UserModel(orango) {
  let UserSchema = new orango.Schema({
    fullname: { type: String },
    email: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    role: { type:Number, allow: [1, 2, 3, 4] },
    token: { type: String },
    tagsId: [],
    companies: [],
    pic: { type: String },
    created: { type: Date, default: Date.now },
    released: Date,
  })
  orango.model('User', UserSchema)
}
module.exports = {
  UserModel
}