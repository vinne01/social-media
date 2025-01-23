const mongoose =require('mongoose');

// mongoose.connect("mongodb://127.0.0.1:27017/posthand");
mongoose.connect("mongodb+srv://vinne0563:mLUi7raEfVS7VMZS@vinaybhai.hexp2.mongodb.net/posthand");


const userSchema =mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]
});

module.exports = mongoose.model('user',userSchema);
