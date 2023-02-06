module.exports.home = function(req, res) {
    //return res.end('<h1>Express is up for Codeial! </h>');
    return res.render('home', {
        title : "Home"
    });
}