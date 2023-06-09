const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
var GitHubStrategy = require('passport-github2').Strategy;
    
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customeMware = require('./config/middleware');

  
const cors = require('cors');
const corsOption = {   credentials: true,   origin: ['http://127.0.0.1:8000'] };
app.use(cors(corsOption));

//   app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     next();
//   })


// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('assets'));


// Make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');



// mongo store is used to store the session cookie in the db
app.use(session( {
    name : 'codeial',
    // TODO change the secret before deployment in production mode. Key for encoding/decoding
    secret : 'something',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000*60*100)
    },
    store : new MongoStore ({
        mongooseConnection : db, 
        autoremove : 'disabled'
    }, 
    function (err){
        console.log( err|| 'connect-mongo-db setup ok')
    }) 
})) 

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customeMware.setFlash);

// use express router
app.use('/', require('./routes')); 


app.listen(port, function(err) {
    if (err) {
        console.log(`Error : ${err}`);
    }
    console.log(`Server is running on post ${port}`);
});