const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema ({
    email : {
        type : String,
        required : true,
        unique : true
    }
});

userSchema.plugin(passportLocalMongoose); // agr user exist hai aur tum same email ya username se again signup krte ho toh signup nhi hogaa

module.exports = mongoose.model('User', userSchema);