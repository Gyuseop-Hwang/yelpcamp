const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // username, password 생략 passport로 작업할 것임.(passport가 필드 생성함)
})

UserSchema.plugin(passportLocalMongoose);
// username 중복을 확인하고, 몇 개의 method가 추가된다.


module.exports = mongoose.model('User', UserSchema);
