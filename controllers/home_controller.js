const Post = require('../models/post')


module.exports.home = function(req, res) {
    //return res.end('<h1>Express is up for Codeial! </h>');
    console.log('Home Controller');
    // console.log(req.cookies);
    // res.cookie('user_id', 25);


    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title : "Codial Home",
    //         posts : posts
    //     });
    
    // })
    
    // Populate the user for each post
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home', {
            title : "Codial Home",
            posts : posts
        });
    
    })


//     return res.render('home', {
//         title : "Home"
//     });
}