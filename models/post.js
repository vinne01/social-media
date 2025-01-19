const mongoose =require('mongoose');
// const post = require('./models/post');

const postSchema =mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type:Date,
        default:Date.now
    },
    content:String,
    image:String,
    
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ]
   
});

module.exports = mongoose.model('post',postSchema);