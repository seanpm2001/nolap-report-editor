'use strict';

var config = require('./protractor-shared-conf').config;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.multiCapabilities = [
{
    'browserName': 'chrome',
    'platform': 'OS X 10.9',
    'name': 'NoLAP Report Editor',
    'tunnel-identifier': process.env.WERCKER_STEP_ID,
    'build': process.env.WERCKER_GIT_COMMIT,
    'version': '34'
}
, 
{
    'browserName': 'firefox',
    'name': 'NoLAP Report Editor',
    'tunnel-identifier': process.env.WERCKER_STEP_ID,
    'build': process.env.WERCKER_GIT_COMMIT,
    'version': '31'
}
//,
//{
//    browserName: 'safari',
//    'platform': 'OS X 10.9',
//    'name': 'NoLAP Report Editor',
//    'tunnel-identifier': process.env.WERCKER_STEP_ID,
//    'build': process.env.WERCKER_GIT_COMMIT,
//    'version': '7'
//}
];

config.allScriptsTimeout = 30000;
config.getPageTimeout = 30000;
config.jasmineNodeOpts.defaultTimeoutInterval = 100000;
config.specs = ['../auth-scenario.js'];
exports.config = config;