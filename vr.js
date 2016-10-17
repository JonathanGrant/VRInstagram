var express = require('express');
var app = express();
var path = require('path');
var FB = require('fb');
var _ = require('underscore');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/vr.html'));
})

app.get('/fb/oauth', function(req, res) {
  FB.api('oauth/access_token', {
    client_id: '1771830826409293',
    client_secret: 'e98e9d34003de465fda4a31f312a6f87',
    redirect_uri: 'http://localhost:3000/fb/oauth',
    code: req.query.code
  }, function (fbres) {
    if(!fbres || fbres.error) {
      console.log(!fbres ? 'error occurred' : fbres.error);
      return;
    }
 
    var accessToken = fbres.access_token;
    var expires = fbres.expires ? fbres.expires : 0;
    console.log(accessToken);
    FB.setAccessToken(accessToken);
    res.sendFile(path.join(__dirname + '/vr.html'));
  });
})

app.get('/fb/me/firstphoto', function(req, res) {
  var photos = [];
  FB.api('/v2.8/me/photos', {access_token: 'EAAZALeIMCnU0BAEALpfoM3YhBZBxORO0FATeGQx5KQKZCwVWWTjNpDDzPfZCFZBb8grzKGwYiyFaMgXwM1RRe0HJLMcpAZCtu9iyAnk1asJ7XdraEP1vvtkogi6dEVte2AhzTHVPFZAGhj8vGXMsA8NIzcJzDPbxlcZD' }, function (fbres) {
    photos = fbres.data;
    FB.api('/v2.8/'+photos[0].id+'/?fields=images', {access_token: 'EAAZALeIMCnU0BAEALpfoM3YhBZBxORO0FATeGQx5KQKZCwVWWTjNpDDzPfZCFZBb8grzKGwYiyFaMgXwM1RRe0HJLMcpAZCtu9iyAnk1asJ7XdraEP1vvtkogi6dEVte2AhzTHVPFZAGhj8vGXMsA8NIzcJzDPbxlcZD' }, function (fbres) {
      console.log(fbres);
      res.send(fbres.images[0].source);
    })
  });
})

app.get('/fb/me/allphotos', function(req, res) {
  var photos = [];
  var numPhotosReturned = 0;
  FB.api('/v2.8/me/photos', {access_token: 'EAAZALeIMCnU0BAEALpfoM3YhBZBxORO0FATeGQx5KQKZCwVWWTjNpDDzPfZCFZBb8grzKGwYiyFaMgXwM1RRe0HJLMcpAZCtu9iyAnk1asJ7XdraEP1vvtkogi6dEVte2AhzTHVPFZAGhj8vGXMsA8NIzcJzDPbxlcZD' }, function (fbres) {
    photos = fbres.data;
    console.log(fbres);
    for(var i=0; i < photos.length; i++) {
      FB.api('/v2.8/'+photos[i].id+'/?fields=images', {access_token: 'EAAZALeIMCnU0BAEALpfoM3YhBZBxORO0FATeGQx5KQKZCwVWWTjNpDDzPfZCFZBb8grzKGwYiyFaMgXwM1RRe0HJLMcpAZCtu9iyAnk1asJ7XdraEP1vvtkogi6dEVte2AhzTHVPFZAGhj8vGXMsA8NIzcJzDPbxlcZD' }, function (fbres) {
        var photo = _.findWhere(photos, {id: fbres.id})
        photo.source = fbres.images[0].source;
        console.log(photo);
        numPhotosReturned++;
        if(numPhotosReturned == photos.length) {
          res.send(photos);
        }
      })
    }
  });
})

app.listen(3000);