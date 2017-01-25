var express = require("express");
var app = express();
var fortune = require('./lib/fortune.js')
var bodyParser  = require('body-parser');
var credentials = require("./credentials.js")
// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//set static folder
app.use(express.static(__dirname + '/public'));
// set up cookie=parser
app.use(require('cookie-parser')(credentials.cookieSecret));
// set up express-session
app.use(require('express-session')({
    resave: false,
    saveUninitalized: false,
    secret: credentials.cookieSecret,
}))
// set up body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));
// set up server
app.set("port", process.env.PORT || 3000);
//set up flash messages
app.use(function(req, res, next){
    // if there's a flash message, transfer it to the content, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

// routes
app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {fortune: fortune.getFortune});
});


// form posting
app.post('/', function(req, res){
    // log the form named "goodThing"
   console.log('Quote (from querystring):' + req.body.goodThing);
    //   redirect back to form page
   req.session.flash = {
       type: 'success',
       intro: 'Thank you!',
       message: "You have now been signed up for the news letter.",
   };
   res.redirect(303, '/');
});

// custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log("Express started...");
});