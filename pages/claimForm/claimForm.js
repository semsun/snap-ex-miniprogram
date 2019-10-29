// pages/testPage/testPage.js
Page({

  /**
   * Page initial data
   */
  data: {
    array:[],
    invoice:{}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'purposes',
      success: (res)=> {
        this.setData({array:res.data})
      },
      fail: (res)=> {
        console.log("ClaimForm onLoad read Storage fail:" + res.errMsg);
        wx.setStorage({
          key: 'purposes',
          data: [],
        })
        this.setData({array:[]})
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  addInvoice: function(e) {
    wx.scanCode({
      success:(res) => {
        var strArr = res.result.split(',');
        console.log(strArr);
        this.setData({
          invoice: {
            code: strArr[2],
            number: strArr[3],
            date: strArr[5],
            amount: parseFloat(strArr[4])
          }
        })

        var param = JSON.stringify(this.data.invoice);
        console.log(param);
        wx.navigateTo({
          url: '/pages/Invoice/InvoicePage?json=' + param,
        })
      }
    })
  },

  summitClick: function(e) {
    var str="11, 22, 33, 44";
    var strArr = str.split(",");
    
    console.log("Arr[0]:" + strArr);
  }

})