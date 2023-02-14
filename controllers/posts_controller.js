const Post = require('../models/post');



module.exports.create = function(req, res) {
    console.log('Posts controller');
    console.log('req.body.content :' + req.body.content);
    Post.create({
        content : req.body.content,
        user : req.user._id
    }, function(err, post) {
        if(err) {
            console.log('error in creating post');
            return;
        }
        return res.redirect('back');
    })

}