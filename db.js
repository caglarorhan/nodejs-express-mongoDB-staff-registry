const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/user-list',{useNewUrlParser: true });

const Schema = mongoose.Schema;
const userSchema = new Schema({
    user_name: String,
    user_lastname: String,
    user_dob: String,
    user_email:String
});

mongoose.model("User",userSchema);

module.exports = mongoose;

