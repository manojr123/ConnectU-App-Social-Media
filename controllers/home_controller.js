module.exports.home = function(req, res) {
    //return res.end('<h1>Express is up for Codeial! </h>');
    console.log('Home Controller');
    console.log(req.cookies);
    res.cookie('user_id', 25);

    return res.render('home', {
        title : "Home"
    });
}