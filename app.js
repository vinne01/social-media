const express = require('express');
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto =require("crypto");
const path =require('path');
const multer =require('multer');
const post = require('./models/post');
const app= express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// 

app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads'); // Folder where files will be stored
    },
    filename: function (req, file, cb) {
      // Naming the file as the current timestamp + original file extension
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload =multer({storage: storage})

app.get('/', (req,res)=>{
    res.render("index");
})
app.get('/login',(req,res)=>{
    res.render("login");
})

// app.get('/profile',isloggedIN, async (req,res)=>{
//   let user =  await userModel.findOne({email:req.user.email}).populate("posts");
 

//     res.render("profile",{user});
// });

app.get('/profile/:id', isloggedIN, async (req, res) => {
    try {
        const userProfile = await userModel.findById(req.params.id).populate("posts");
        const isOwnProfile = req.user.userid.toString() === req.params.id; // Check if the logged-in user is viewing their own profile
        res.render("profile", { user: userProfile, isOwnProfile });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Internal Server Error");
    }
});





// app.get('/like/:id',isloggedIN, async (req,res)=>{

//     let user =  await postModel.findOne({_id: req.params.id}).populate("user");
//    if(post.likes.indexOf(req.user.userid) === -1){
//     post.likes.push(req.user.userid)  ;
//     // console.log(req.user);
//    }
//    else{
//     post.likes.splice(post.likes.indexOf(req.user.userid),1);
//    }

  
//    await post.save();
//   //   console.log(user);
//       res.redirect("/profile");
//   });
app.get('/like/:id', isloggedIN, async (req, res) => {
    try {
        // Retrieve the post by ID
        let post = await postModel.findOne({ _id: req.params.id });

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Initialize likes as an empty array if it's undefined
        if (!post.likes) {
            post.likes = [];
        }

        // Check if the user has already liked the post
        if (post.likes.indexOf(req.user.userid) === -1) {
            // User hasn't liked the post, so add the like
            post.likes.push(req.user.userid);
        } else {
            // User has already liked the post, so remove the like
            post.likes.splice(post.likes.indexOf(req.user.userid), 1);
        }

        // Save the updated post
        await post.save();

        // Redirect back to the dashboard
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error liking the post:", error);
        res.status(500).send("Internal Server Error");
    }
});
//end chatgpt 
app.get('/edit/:id', isloggedIN, async (req, res) => {
    let post = await postModel.findOne({_id:req.params.id}).populate("user");
    //we render {post } which help to render post data in ejs file
    res.render("edit",{post})
       
      
}); 

app.post('/update/:id', isloggedIN, async (req, res) => {
  await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
    //we render {post } which help to render post data in ejs file
    res.redirect("/dashboard");
       
      
}); 



app.post('/post', upload.single('image'), isloggedIN, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let { content } = req.body;

        // Image URL (if an image is uploaded)
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/images/uploads/${req.file.filename}`;
        }

        let newPost = await postModel.create({
            user: user._id,
            content,
            image: imageUrl, // Save the image URL in the post
            date: Date.now()
        });

        user.posts.push(newPost._id);
        await user.save();

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/register',async (req,res)=>{
    let {email,password, username ,name, age} =req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(5000).send("user already registered");

        bcrypt.genSalt(10,(err,salt)=>{
            
                bcrypt.hash(password,salt,  async (err,hash)=>{
          let  user =  await userModel.create({
                        username,
                        email,
                        age,
                        name,
                        password:hash
                    });
                let token =jwt.sign({email:email,userid:user._id},"shhhh");
                res.cookie("token",token) ;
                res.redirect(`/profile/${user._id}`);
            
            })
        })

});
app.post('/login',async (req,res)=>{
    let {email,password} =req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("something went wrong");

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token =jwt.sign({email:email,userid:user._id},"shhhh");
                res.cookie("token",token) ;
                res.status(200).redirect(`/profile/${user._id}`);
            }
        else {
            res.redirect("/login");
        }
    })

       
            
            

});

app.get('/logout',(req,res)=>{
  res.cookie("token","");
  res.redirect("/login") ;  
});

app.get('/test', (req,res)=>{
    res.render("test");
});
app.post('/upload',upload.single('image'), (req,res)=>{
    console.log(req.file);
});
//middleware play important role if user is login and isloggin set where
// user direct open profile but if not login then if user open profile
//using /profile then render login pplease or say to login
//
// function isloggedIN(req,res,next){
//     if(req.cookies.token === "") res.redirect("/login");
//     else{
//         let data =jwt.verify(req.cookies.token,"shhhh");
//         req.user = data;
//     }
//     next();
// }
// In your routes (Express.js)
// app.get('/dashboard', isloggedIN, async (req, res) => {
//     try {
//         // Fetch all posts from all users
//         let posts = await postModel.find().populate('user'); // Ensure the `user` data is populated

//         // Render the dashboard with all posts
//         res.render('dashboard', { posts });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });
// app.get('/dashboard', isloggedIN, async (req, res) => {
//     try {
//         // Fetch all posts from all users
//         let posts = await postModel.find().populate('user'); // Ensure the `user` data is populated

//         // Fetch the logged-in user details
//         let loggedInUser = req.user;

//         // Render the dashboard with all posts and the logged-in user
//         res.render('dashboard', { posts, user: loggedInUser });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });
app.get('/dashboard', isloggedIN, async (req, res) => {
    try {
        // Fetch all posts from all users
        let posts = await postModel.find().populate('user'); // Ensure the `user` data is populated
        
        // Fetch the logged-in user details
        let loggedInUser = req.user;

        // Render the dashboard with all posts and the logged-in user
        res.render('dashboard', { posts, user: loggedInUser });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Internal Server Error");
    }
});



function isloggedIN(req, res, next) {
    if (!req.cookies.token || req.cookies.token === "") {
        return res.redirect("/login");
    }

    try {
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data; // Add the decoded data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // If the token is invalid, redirect to login
        console.error("JWT verification failed:", err);
        return res.redirect("/login");
    }
}



// app.listen(3000);
// add dynamic ports
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
app.listen(3000, () => {
    console.log('Server is listenin on PORT :' + PORT);
})
