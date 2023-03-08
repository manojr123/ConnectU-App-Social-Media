const Friend = require('../models/friend');
const User = require('../models/user');

module.exports.add = async function(req, res) {

    console.log('Friends Controller : Add');
    
    console.log('FC : req.parms.id', req.params.id);
    console.log('FC : req.user', req.user);
    console.log('FC : req.body', req.body);

    try {


        //await Friend.deleteMany({});
        let to_user  = await User.findById({_id : req.params.id });

        to_user.friend_requests.push(req.user.id);
        //from_user.friends.pull(req.user.id);
        to_user.save();



        /*
        await Friend.create({from_user : req.user.id,
                             to_user : req.params.id});
        //await Friend.deleteMany({});

        let from_user  = await User.findById({_id : req.user.id });

        from_user.friends.push(req.params.id);
        //from_user.friends.pull(req.user.id);
        from_user.save();
        */

    } 
    catch (err) {
        console.log( "Error from Friends Controller : ", err);
    }
    return res.redirect('back');




}    

module.exports.requests = async function(req, res) {

    console.log('Friends Controller : Requests');
    console.log('FC : req.parms.id', req.params.id);
    console.log('FC : req.user', req.user);
    console.log('FC : req.body', req.body);

    try {
        // await Friend.deleteMany({});
        // return res.redirect('back');
        let friend_requests =[];
        let my_friends = [];
        let users = await User.find({});

        if( req.user) {
            let user = await User.findById({_id:req.user.id })
            .populate({
                path : 'friend_requests'
            });
            //user.friend_requests = [];
            //user.save();
            friend_requests = user.friend_requests;

            console.log('FC : user',user);
            console.log('FC : friend_requests',friend_requests);
            my_friends = await Friend.find({$or :[{from_user: req.user.id},{to_user : req.user.id }] });

            // .populate('from_user', 'name')
            // .populate('to_user','name');
                
            //my_friends =[];
    
            if (req.xhr) {
                console.log('FC : req.xhr')
                return res.status(200).json({
                    data: {
                        friend_requests : friend_requests
                    },
                    message : 'Friend Requests!'
                })
            } else {
                console.log('FC : my_friends',my_friends);
                return res.render('home', {
                    title : "Codial Home",
                    all_users : users,
                    my_friends : my_friends,
                    friend_requests : friend_requests,
                    display_friend_requests : true
                });    
            }
        }

    
    } catch (err) {
        console.log( "Error from Friends Controller : Requests : ", err);
    }
    //return res.redirect('back');
    


}

module.exports.accept = async function(req, res) {

    console.log('Friends Controller : Accept');
    console.log('FC : req.parms.id', req.params.id);
    console.log('FC : req.user', req.user);
    console.log('FC : req.body', req.body);

    try {
        // await Friend.deleteMany({});
        // return res.redirect('back');


        await Friend.create({from_user : req.params.id ,
            to_user : req.user.id});
    
        let to_user  = await User.findById({_id : req.user.id });
    
        to_user.friend_requests.pull(req.params.id);
        //from_user.friends.pull(req.user.id);
        to_user.save();
    
    } catch (err) {
        console.log( "Error from Friends Controller : Accept : ", err);
    }
    return res.redirect('back');
    


}

module.exports.destroy = async function(req, res) {

    console.log('Friends Controller : Delete');
    
    already_friends = await Friend.deleteMany({$or :[{from_user: req.user.id,
                                                to_user : req.params.id },
                                                {from_user : req.params.id,
                                                    to_user:req.user.id }] 
                                        });

   console.log('FC : already_friends :', already_friends);




   return res.redirect('back');
                                     
}