// pages/dashboard/dashboard.js
const util = require('../../utils/util.js')
const app = getApp()
var api = require('../../utils/authRequest.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 数据源
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

  gotoLogin: function(e) {
    wx.navigateTo({
      url: '/pages/Login/Login',
    })
  },

  getExpenseList: function(that) {
    api.request({
      url: app.globalData.host + ":" + app.globalData.port + "/snapex/expense/search",
      method: "POST",
      data: {
        "staffId": app.globalData.staffId
      },
      header: {
        WechatAccessToken: null
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
              title: v.description,
              date: util.formatDate(new Date(v.submittedDate)),
              status: v.status,
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
    var param = {
      isAdd: false,
      expenseId: e.mark.itemdata.expenseId,
      purposeStatus: e.mark.itemdata.status
    }
    wx.navigateTo({
      url: '/pages/requestPage/requestPage?json=' + JSON.stringify(param),
    })
  },

  onNetworkFail() {
    wx.showToast({
      title: 'Server error',
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })

  }
})