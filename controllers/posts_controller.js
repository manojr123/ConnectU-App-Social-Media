const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function(req, res) {
    console.log('Posts controller');
    console.log('req.body.content1 :' + req.body.content);
    console.log('req.user:' + req.user);

    try {
        let postImage="";

        console.log('Post.statics.postPath :' + Post.postPath );

        Post.uploadedPost(req,res, function(err) {
            if ( err) {
                console.log('*********Multer Error: ', err);
            }
                console.log('req.file :' + req.file );
                console.log('req.body.content inside Post.uploadedPost :' + req.body.content );
                if( req.file) {
                    // if ( user.avatar) {
                    //     fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    // }

                    // This is saving the path of the uploaded file into the avatar field in the user
                    console.log('inside req.file :');
                    postImage = Post.postPath + '/' + req.file.filename;
                    //console.log('postImage :' + postImage );
                }
                console.log('req.body.content2 :' + req.body.content);                                 
                if ( postImage == "") {
                    console.log('post.image is blank:');  
                    postImage ="\\uploads\\posts\\images/postimage-1677856736276-697230852";                               
                }

                Post.create({
                    content : req.body.content,
                    user : req.user._id,
                    image : postImage
                }, function (err, post) {
                    console.log('req.body.content3 :' + req.body.content);                                 
                    console.log('post.image :' + post.image);                                 


                    if ( req.xhr) {
                        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
                        console.log('request is xhr....');
                        post.populate('user', 'name')
                            .then((post) => {
                                // post.createdAt = post.createdAt.substring(4,14);
                                console.log('post.createdAt :', post.createdAt);
                                return res.status(200).json ({
                                    data : {
                                        post : post
                                    },
                                    message : "Post created!"
                                })        
                            } )                       
                    } else {            
                        req.flash('success','Post published!');
                        return res.redirect('back');
                    }

                });                

        });
        // await Post.uploadedPost(req,res);

        // if ( err) {
        //     console.log('*********Multer Error: ', err);
        // }
        //     console.log('req.file :' + req.file );
        //     console.log('req.body.content inside Post.uploadedPost :' + req.body.content );
        //     if( req.file) {
        //         // if ( user.avatar) {
        //         //     fs.unlinkSync(path.join(__dirname,'..',user.avatar))
        //         // }

        //         // This is saving the path of the uploaded file into the avatar field in the user
        //         postImage = Post.imagePath + '/' + req.file.filename;
        //         console.log('postImage :' + postImage );
        //     }
        //  console.log('req.body.content2 :' + req.body.content);        


        console.log('req.body.content3 :' + req.body.content);        

        // let post = await Post.create({
        //     content : req.body.content,
        //     user : req.user._id,
        //     // image : postImage
        // });

        // if ( req.xhr) {
        //     // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        //     post = await post.populate('user', 'name');


        //     return res.status(200).json ({
        //         data : {
        //             post : post
        //         },
        //         message : "Post created!"
        //     })
        // }

        // req.flash('success','Post published!');
        // return res.redirect('back');

    } catch (err) {
        req.flash('error','Post published!');

        console.log('Error creating POST in try block :', err);

        return res.redirect('back');
    } 
}

module.exports.destroy = async function (req,res) {
    
    try {
        let post = await Post.findById(req.params.id);

        if ( post.user == req.user.id) {

           // CHANGE :: delete the associated likes for the post and all its comments' likes too
           await Like.deleteMany({likeable: post, onModel: 'Post'});
           await Like.deleteMany({_id: {$in: post.comments}});


           post.remove();
    
           await Comment.deleteMany( {post : req.params.id});

            if ( req.xhr) {
                return res.status(200).json ({
                    data : {
                        post_id : req.params.id
                    },
                    message : "Post deleted"
                })
            };

           req.flash('success','Post and associated comments deleted !');

           return res.redirect('back');
    
        } else {
            req.flash('error','You cannot delete this post !');
            return res.redirect('back');
        }    
    
    }catch (err){
        console.log("Error", err);
        return res.redirect('back');

    }
    

}