const assert = require('assert')

exports.SupportDataTests = function (testingApp, defaultTimeout)
{
  describe('Support Data',  function ()
  {
    this.timeout(defaultTimeout);
  
    it('Can access App Services', async function () 
    {
      testingApp.webContents.send('Test.Services.SupportData');
      this.supportDataServiceAvailable = await testingApp.client.execute(() =>
      {
        return window.supportDataServiceAvailable;
      });
  
      assert(this.supportDataServiceAvailable, "SupportDataService unavailable.");
    })
    it('Can access KeyMapping', async function ()
    {
      
      if(this.supportDataServiceAvailable == null)
      {
        this.skip();
      }
      testingApp.webContents.send('Test.Services.SupportData.KeyMapping', 5, "F");
  
      const result = await testingApp.client.execute(() =>
      {
        return window.keymappingResult;
      });
      assert(result, "SupportData Keymapping invalid.");
    });
  
  });
}