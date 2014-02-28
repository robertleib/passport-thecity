# Passport-TheCity

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [The City](http://api.onthecity.org/) using the OAuth 2.0 API.

This module lets you authenticate using The City, in your Node.js applications.  
By plugging into Passport, The City
authentication can be easily and unobtrusively integrated into any application or
framework that supports [Connect](http://www.senchalabs.org/connect/)-style
middleware, including [Express](http://expressjs.com/).

[![Build Status](https://travis-ci.org/robertleib/passport-thecity.png?branch=master)](https://travis-ci.org/robertleib/passport-thecity)

## Install

    $ npm install passport-thecity

## Usage

#### Configure Strategy

The City authentication strategy authenticates users using a City user
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new TheCityStrategy({
        clientID: APP_ID,
        clientSecret: APP_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/thecity/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ cityUserId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'thecity'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/thecity',
      passport.authenticate('thecity'));

    app.get('/auth/thecity/callback', 
      passport.authenticate('thecity', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/robertleib/passport-thecity/tree/master/examples/login).



## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Robert Leib
