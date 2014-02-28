/**
 * Module dependencies.
 */
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError
  , uri = require('url')
  , util = require('util');


function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = process.env.THECITY_AUTHORIZATION_URL || options.authorizationURL || 'https://authentication.onthecity.org/oauth/authorize';
  options.tokenURL = process.env.THECITY_TOKEN_URL || options.tokenURL || 'https://authentication.onthecity.org/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {'Accept': 'application/vnd.thecity.v1+json', 'X-CITY-SUBDOMAIN': options.subdomain};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'thecity';
  this._subdomain = options.subdomain;
  this._profileURL = options.profileURL || 'https://api.onthecity.org/me';
  this._oauth2._useAuthorizationHeaderForGET = true;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.userProfile = function(accessToken, done) {
  var url = uri.parse(this._profileURL).format(url);

  this._oauth2.get(url, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'thecity' };
      profile.id = json.id;
      profile.name = json.name;
      profile.email = json.email;
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

Strategy.prototype.authorizationParams = function(options) {
  if (this._subdomain) { return {subdomain: this._subdomain}; } else { return {}; } ;
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;