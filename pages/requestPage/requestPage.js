// pages/requestPage/requestPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 数据源
    listdata: [{
      title: 'Team Build',
      amount: '28.7',
      icon: '/images/icons/teambuild_selected.png'
    }, {
      title: 'Traffic',
      amount: '300',
      icon: '/images/icons/bus_selected.png'
    }, {
      title: 'Room',
      amount: '17',
      icon: '/images/icons/house_selected.png'
    }, {
      title: 'Food',
      amount: '180',
      icon: '/images/icons/meat_selected.png'
    }, {
      title: 'Training',
      amount: '300',
      icon: '/images/icons/training_selected.png'
    }, {
      title: 'Travel',
      amount: '907',
      icon: '/images/icons/travel_selected.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  addInvoice: function(e) {
    wx.scanCode({
      success: (res) => {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})