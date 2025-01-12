const { SupportDataTests } = require('./SupportData.spec.js');

const { Application } = require('spectron')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path');
const { DeviceTests } = require('./Devices.spec.js');

const testTimeout = 10000;
const beforeTimeout = 10000;
const afterTimeout = 10000;
const testingApp = new Application({
  // Your electron path can be any binary
  // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  // But for the sake of the example we fetch it from our node_modules.
  path: electronPath,

  // Assuming you have the following directory structure

  //  |__ my project
  //     |__ ...
  //     |__ main.js
  //     |__ package.json
  //     |__ index.html
  //     |__ ...
  //     |__ test
  //        |__ spec.js  <- You are here! ~ Well you should be.

  // The following line tells spectron to look and use the main.js file
  // and the package.json located 1 level above.
  args: [path.join(__dirname, '../electron-index.js')],
  chromeDriverArgs: ['remote-debugging-port=9222'],
});

beforeEach(async function () {
  this.timeout(beforeTimeout);
  await testingApp.start();
});

afterEach(async function () 
{
  this.timeout(afterTimeout);
  if (testingApp && testingApp.isRunning()) 
  {
    await testingApp.stop();
  }
});

SupportDataTests(testingApp, testTimeout);
DeviceTests(testingApp, testTimeout);