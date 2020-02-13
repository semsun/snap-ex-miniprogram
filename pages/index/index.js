// pages/dashboard/dashboard.js
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // 数据源
    // listdata: [{
    //   title: 'Angel Fund 5W 报销',
    //   date: '2019-12-07',
    //   status: 'draft'
    // }, {
    //   title: 'Angel Fund 5K round2',
    //   date: '2019-11-07',
    //   status: 'draft'
    // }, {
    //   title: 'Angel Fund 1K round1',
    //   date: '2019-10-07',
    //   status: 'submmited'
    // }, {
    //   title: '西安trip',
    //   date: '2019-10-01',
    //   status: 'submmited'
    // }, {
    //   title: 'HK trip',
    //   date: '2019-9-07',
    //   status: 'submmited'
    // }, {
    //   title: 'HK trip',
    //   date: '2019-8-07',
    //   status: 'submmited'
    // }]
    listdata: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.getExpenseList(that)
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getExpenseList: function(that) {
    wx.request({
      url: app.globalData.host + ":" + app.globalData.port + "/snapex/expense/search",
      method: "POST",
      data: {
        "staffId": app.globalData.staffId
      },
      success(res) {
        console.log(res.data)
        var listData = []
        if (typeof(res.data.items) == typeof(undefined)) {
          that.onNetworkFail()
        } else {
          res.data.items.forEach(v => {
            listData.push({
              // title: v.expenseId,
              title: '西安 trip',
              date: util.formatDate(new Date(v.submittedDate)),
              status: 'submmited',
              expenseId: v.expenseId
            })
          })
          that.setData({
            listdata: listData
          })
        }
      },
      fail(res) {
        that.onNetworkFail()
        console.log(res)
      }
    })
  },

  addInvoice() {
    var param = {
      isAdd: true
    }
    wx.navigateTo({
      url: '/pages/requestPage/requestPage?json=' + JSON.stringify(param),
    })
  },

  toInvoice(e) {
    console.log(e)
    var param = {
      isAdd: false,
      isLocal: e.mark.itemdata.status != 'submmited',
      expenseId: e.mark.itemdata.expenseId
    }
    wx.navigateTo({
      url: '/pages/requestPage/requestPage?json=' + JSON.stringify(param),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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

  },

  onNetworkFail() {
    wx.showToast({
      title: 'Server error',
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })

  }
})