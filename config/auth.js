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
        'clientID'        : '154770778569773',
        'clientSecret'    : '62c23b93db63ddd561e83ed4358ad3be',
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email',
        'profileFields'   : ['id', 'email', 'displayName', 'profileURL','username', 'link', 'gender', 'photos'] // For requesting permissions from Facebook API

    }
};