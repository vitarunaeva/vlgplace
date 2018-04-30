module.exports = {

    'odnoklassnikiAuth': {
        'clientID'  :   'odnoklassniki_app_id',
        'clientPublic'  : 'odnoklassniki_app_public_key',
        'clientSecret'  :   'odnoklassniki_app_secret_key',
        'callbackURL'   : 'http://localhost:8080/auth/ok/callback',
        'profileFields' : ['id', 'email', 'name']
    },
    'vkAuth': {
        'clientID'  : '6425432',
        'clientSecret' : 'beb50JU2x4gRVV6ikt11',
        'callbackURL' : 'http://localhost:8080/auth/vkontakte/callback',
        'profileFields' : ['id', 'email', 'name']
    },

    'facebookAuth' : {
        'clientID'        : '251549642056373',
        'clientSecret'    : '1844583370902644cd7a2ab1e0cc76c5',
        'callbackURL'     : 'http://vlgplace.herokuapp.com/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email',
        'profileFields'   : ['id', 'email', 'displayName', 'profileURL','username', 'link', 'gender', 'photos'] // For requesting permissions from Facebook API

    }
};