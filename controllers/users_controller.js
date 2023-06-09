
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friend = require('../models/friend');


module.exports.profile = async function(req,res) {
    //return res.end('<h1> User Profile </h1> ');
    let already_friends = false;

    const friend_data = await Friend.find({$or :[{from_user: req.user.id,
        to_user : req.params.id },
        {from_user : req.params.id,
            to_user:req.user.id }] 
    });

    if (friend_data.length != 0) {
        already_friends = true;
    }

    console.log("User Controller : Profile");
    console.log("User Controller : friend_data", friend_data);
    console.log("User Controller : already_friends", already_friends);

    const user = await User.findById(req.params.id);
    
    
    
    return res.render('user-profile', {
           title : "User Profile",
           profile_user : user,
           already_friends : already_friends
    });
    
    


}
module.exports.update = async function(req,res) {
    // if ( req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     })
    // } else {
    //     return res.status(401).send('Unauthorized');
    // }

    // Converting to async await
    if ( req.user.id == req.params.id) {
        try {
            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if ( err) {
                    console.log('*********Multer Error: ', err);
                }
                    user.name = req.body.name;
                    user.email = req.body.email;
                    console.log('req.file :' + req.file );

                    if( req.file) {

                        // if ( user.avatar) {
                        //     fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                        // }

                        // This is saving the path of the uploaded file into the avatar field in the user
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                        console.log('user.avatar :' + user.avatar );
                    }
                    user.save();
                    return res.redirect('back');
            });


        } catch(err) {
            console.log("Error", err);
            return res.redirect('back');
        }



    } else {
        return res.status(401).send('Unauthorized');
    }




}


module.exports.login = function(req,res) {
    //return res.end('<h1> Login </h1> ');
    return res.render('user-profile', {
        title : "User Login"
    });

}
// render the sign up page
module.exports.signUp = function(req,res) {
    //return res.end('<h1> Login </h1> ');

    if ( req.isAuthenticated() ){
        return res.redirect('/users/profile');
    }; 

    return res.render('user-sign-up', {
        title : "Codeial | Sign Up"
    });

}

// render the sign in page
module.exports.signIn = function(req,res) {
    //return res.end('<h1> Login </h1> ');

    if ( req.isAuthenticated() ){
        return res.redirect('/users/profile');
    }; 


    return res.render('user-sign-in', {
        title : "Codeial | Sign In"
    });

}
// get the sign up data
module.exports.create = function(req,res) {
    console.log('In create action');
    if ( req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email:req.body.email}, function (err,user){
        if ( err) { console.log('error in finding user in signing up'); return };

        if(!user) {
            User.create(req.body, function  (err, user) {
                if ( err) { console.log('error in creating user while signing up'); return };

                return res.redirect('/users/sign-in');

            })
        } else {
            return res.redirect('back');

        }
    })


}
// Sign In and create a session for the User
module.exports.createSession = function(req,res) {

    req.flash ('success','Logged in Successfully');

    return res.redirect('/');
    
}

module.exports.destroySession = function(req,res) {

    // Passport gives logout to request
    req.logout(function(err) {
            if (err) { return next(err); }
            req.flash ('success','You have logged out!');
            return res.redirect('/');
    });
    //return res.redirect('/');
    
}

