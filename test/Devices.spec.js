const assert = require('assert')
const path = require('path')

exports.DeviceTests = function (testingApp, defaultTimeout)
{
  describe('Devices', function () 
  {
    this.timeout(defaultTimeout);

    it('Can access Battery', async function () 
    {
      testingApp.webContents.send('Test.Services.SupportData');
      this.supportDataServiceAvailable = await testingApp.client.execute(() =>
      {
        return window.supportDataServiceAvailable;
      });

      assert(this.supportDataServiceAvailable, "SupportDataService unavailable.");
    })
    it('Battery updates at 5 second interval', async function ()
    {
      
      // if(this.supportDataServiceAvailable == null)
      // {
      //   this.skip();
      // }
      // app.webContents.send('Test.Services.SupportData.KeyMapping', 5, "F");

      // const result = await app.client.execute(() =>
      // {
      //   return window.keymappingResult;
      // });
      // assert(result, "SupportData Keymapping invalid.");
    });

  });
}