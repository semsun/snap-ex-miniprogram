// pages/requestPage/requestPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLocal: false,
    isAdd: true,
    expenseId: "",
    btnContext: "Save",
    pageData: {
      purposeDescription: "",
      totalAmount: "",
      item: []
    },
    // 数据源
    listdata: [{
      title: 'Team Build',
      amount: '--',
      icon: '/images/icons/teambuild_selected.png'
    }, {
      title: 'Traffic',
      amount: '--',
      icon: '/images/icons/bus_selected.png'
    }, {
      title: 'Room',
      amount: '--',
      icon: '/images/icons/house_selected.png'
    }, {
      title: 'Food',
      amount: '--',
      icon: '/images/icons/meat_selected.png'
    }, {
      title: 'Training',
      amount: '--',
      icon: '/images/icons/training_selected.png'
    }, {
      title: 'Travel',
      amount: '--',
      icon: '/images/icons/travel_selected.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var param = JSON.parse(options.json)
    console.log(param)
    var isAdd_t = typeof(param.isAdd) != undefined ? param.isAdd : true
    var isLocal_t = typeof(param.isLocal) != undefined ? param.isLocal : true
    this.setData({
      isAdd: isAdd_t,
      isLocal: isLocal_t,
      btnContext: isAdd_t ? "Save" : "Add",
      expenseId: param.expenseId
    })
    if (!isAdd_t && !isLocal_t) {
      this.getPurposeData(this, param.expenseId)
    }
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

  getPurposeData: function(that, expenseId) {
    wx.request({
      url: app.globalData.host + ":" + app.globalData.port + "/snapex/expense/" + expenseId + "/detail",
      success(res) {
        console.log(res.data)
        var tempPageData = {
          purposeDescription: "西安 trip",
          totalAmount: "2000"
        }
        that.setData({
          pageData: tempPageData
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  savePurposeData: function(that) {

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