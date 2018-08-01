/**
 * Teamcity doc reference https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
 *
 * Module dependencies.
 */
'use strict';
const util = require('util');

const TEST_IGNORED = `##teamcity[testIgnored name='%s' message='%s']`;
const SUITE_START = `##teamcity[testSuiteStarted name='%s']`;
const SUITE_END = `##teamcity[testSuiteFinished duration='%s']`;
const TEST_START = `##teamcity[testStarted name='%s' captureStandardOutput='true']`;
const TEST_FAILED = `##teamcity[testFailed name='%s' message='%s' details='%s' captureStandardOutput='true']`;
const TEST_END = `##teamcity[testFinished name='%s' duration='%s']`;

const STATE_SUITE_START = 0;
const STATE_SUITE_ON_PROGRESS = 1;
const STATE_SUITE_END = 2;

function escape(str) {
  if (!str) return '';
  return str
    .toString()
    .replace(/\x1B.*?m/g, '') // eslint-disable-line no-control-regex
    .replace(/\|/g, '||')
    .replace(/\n/g, '|n')
    .replace(/\r/g, '|r')
    .replace(/\[/g, '|[')
    .replace(/\]/g, '|]')
    .replace(/\u0085/g, '|x')
    .replace(/\u2028/g, '|l')
    .replace(/\u2029/g, '|p')
    .replace(/'/g, '|\'');
}

function formatString() {
  let formattedArguments = [];
  const args = Array.prototype.slice.call(arguments, 0);
  // Format all arguments for TC display (it escapes using the pipe char).
  let tcMessage = args.shift();
  args.forEach((param) => {
    formattedArguments.push(escape(param));
  });
  formattedArguments.unshift(tcMessage);
  return util.format.apply(util, formattedArguments);
}

function getTestName(browser, test) {
  var suite = test.test[0];
  var name = test.test.slice(1).join(".").replace(/ /g, '_');
  var browserIdentifier = browser.browserName + browser.version.replace(/\./g, '_');

  return `${suite}:${name}.${browserIdentifier}`;
};


module.exports = function(wct) {
  wct.on('test-start', function (browser, test) {
    console.log(formatString(TEST_START, getTestName(browser, test)));
  });

  wct.on('test-end', function (browser, test, err) {
    if(test.state === 'pending') {
      console.log(formatString(TEST_IGNORED, getTestName(browser, test), ""));
    } else {
      if(test.state === 'failing') {
        console.log(formatString(TEST_FAILED, getTestName(browser, test), test.error.message, test.error.stack));
      }
      console.log(formatString(TEST_END, getTestName(browser, test), test.duration));
    }
  })
};