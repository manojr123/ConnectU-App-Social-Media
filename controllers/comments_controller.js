const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('./mailers/comments_mailer');
const commentEmailerWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

module.exports.create = async function(req, res){
console.log('inside comments controller:create')
    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            // Similar for comments to fetch the user's id
            comment =await comment.populate('user', 'name email');

            // send email
            //commentsMailer.newComment(comment);
            let job =  queue.create('emails', comment).save(function(err) {
                if ( err) {
                    console.log('error in sending to the a queue', err);
                    return;
                }
            })
            console.log('job enqueued' + job.id);

            // if (req.xhr) {
            //     // Similar for comments to fetch the user's id
            //     comment =await comment.populate('user', 'name').execPopulate();

            //     return res.status(200).json({
            //         data: {
            //             comment : comment
            //         },
            //         message : 'Post created!'
            //     })
            // }

            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
    
}