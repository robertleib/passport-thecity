var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , TheCityStrategy = require('passport-thecity').Strategy;

var THECITY_APP_ID = process.env.THECITY_APP_ID || "d0bacdd802d1c792dcd9b4fb906454925112867e7d26797cab9a550da263f7fe"
var THECITY_APP_SECRET = process.env.THECITY_APP_SECRET || "1824354dd21197019ddb29232335170127b57a926815d2be889bdac57f836ac5";


passport.serializeUser( function(user, done) {
  done(null, user);
});

passport.deserializeUser( function(obj, done) {
  done(null, obj);
});

passport.use(new TheCityStrategy({
    clientID: THECITY_APP_ID,
    clientSecret: THECITY_APP_SECRET,
    callbackURL: "http://127.0.0.1:3030/auth/thecity/callback",
    subdomain: 'mychurch'
  },
  function(accessToken, refreshToken, profile, done) {
      
    // Lookup and/or create a User, etc, etc
    console.log('oauth_token: ' + accessToken);
    //console.log(profile)
    return done(null, profile);
  }
));

var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'blahblahblah' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/profile', ensureAuthenticated, function(req, res){
  res.render('profile', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/thecity
//   This is the url that kicks off the oauth flow, normally you would link a sign-in button to this url on your server
app.get('/auth/thecity',
  passport.authenticate('thecity', {scope: 'user_basic'}),
  function(req, res){
    // this is never called, since we will get redirected to /auth/thecity/callback
  });

// GET /auth/thecity/callback
//   this is the redirect url you registered with your plugin on The City
app.get('/auth/thecity/callback', 
  passport.authenticate('thecity', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3030);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}