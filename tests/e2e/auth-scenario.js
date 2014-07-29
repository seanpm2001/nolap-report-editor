'use strict';

//https://github.com/angular/protractor/blob/master/docs/api.md
//GetAttribute() returns "boolean" values and will return either "true" or null

describe('Authentication', function(){

    var AuthPage = require('../../app/auth/auth-page');
    var auth = new AuthPage();

    it('should have been redirected to the auth page', function() {
        auth.logout();
        auth.getCurrentUrl().then(function(url){
            expect(url.substring(url.length - '/auth'.length)).toBe('/auth');
        });
    });

    it('shouldn\'t login', function(){
        auth.login('w@28.io', 'hello');
        expect(auth.wrongCombinasionMessage().isDisplayed()).toBe(true);
    });
    
    it('should login', function(){
        auth.login('w@28.io', 'foobar');
        auth.getCurrentUrl().then(function(url) {
            expect(url.substring(url.length - 1)).toBe('/');
        });
    });
});