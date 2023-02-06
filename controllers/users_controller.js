module.exports.profile = function(req,res) {
    //return res.end('<h1> User Profile </h1> ');
    return res.render('user-profile', {
        title : "User Profile"
    });

}
module.exports.login = function(req,res) {
    //return res.end('<h1> Login </h1> ');
    return res.render('user-profile', {
        title : "User Login"
    });

}