const User = require('../../../models/user');
const jwt = require('jsonwebtoken'); 


// Sign In and create a session for the User
module.exports.createSession = async function(req,res) {
    
    console.log('Inside Users Api : create session')
    try {
        let user = await User.findOne({email:req.body.email });

        if ( !user || user.password != req.body.password) {
            return res.json(422, {
                message : "invalid username or password"
            });
        }

        return res.json(200, {
            message : "Sign in successfull, here is your token, pls keep it safe",
            data : {
                token : jwt.sign(user.toJSON(), 'codeial', {expiresIn : '100000'})
            }
        })

    } catch(err) {
        console.log("Error", err);
        return res.json(500, {
            message : "Internal Server Error"
        })

    }
    
    
    
}


module.exports.destroy = async function (req,res) {
    
    try {
        let post = await Post.findById(req.params.id);

        if ( post.user == req.user.id) {
            post.remove();
    
           await Comment.deleteMany( {post : req.params.id});

           return res.json(200, {
            message : "Post and associated comments deleted successfully!"
           }); 
    
        } else {
            return res.json(401, {
                message: "You cannot delete this post! "
            })
        }    
    
    }catch (err){
        console.log("Error", err);
        return res.redirect('back');

    }
    

}


