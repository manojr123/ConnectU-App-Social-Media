const Post = require('../models/post')

const User = require('../models/user');
const Friend = require('../models/friend');

module.exports.home = async function(req, res) {
    

    console.log('Home Controller');
    console.log('HC : user', req.user);

    if ( req.user) {
        console.log('HC : user logged in');


    } else {
        console.log('HC : user not logged in');
    }

    try {
        // Populate the user for each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path: 'user'
            },
            populate : {
                path : 'likes'
            }
        }).populate('likes');

        //console.log('HC : posts : ', posts);
        // console.log('HC : posts[0].comments : ', posts.comments);

        let users = await User.find({});
        //let my_friends = await Friend.find({});
        let friend_requests =[];
        let my_friends = [];
        let display_friend_requests = false;
        if( req.user) {
            let user = await User.findById({_id:req.user.id })
            .populate({
                path : 'friend_requests'
            });
            //user.friend_requests = [];
            //user.save();
            friend_requests = user.friend_requests;

            console.log('HC : user',user);
            console.log('HC : friend_requests',friend_requests);
            //my_friends = await Friend.find({$or :[{from_user: req.user.id},{to_user : req.user.id }] });

            // .populate('from_user', 'name')
            // .populate('to_user','name');
                
            //my_friends =[];
    
            console.log('HC : my_friends',my_friends);
    
        }


        return res.render('home', {
            title : "Codial Home",
            posts : posts,
            all_users : users,
            my_friends : my_friends,
            friend_requests : friend_requests,
            display_friend_requests : display_friend_requests

        });
    

    } catch (err) {
        console.log('Error in HC', err);
        return;
    }



//     return res.render('home', {
//         title : "Home"
//     });
}