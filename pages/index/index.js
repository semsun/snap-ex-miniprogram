// pages/dashboard/dashboard.js
const util = require('../../utils/util.js')
const app = getApp()
var api = require('../../utils/authRequest.js')
const API_SEARCH = app.globalData.host + "/expense/search"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShowExitDialog: false,
    isShowExitBtn:'none',
    buttons: [{
      text: 'Cancel'
    }, {
      text: 'Yes'
    }],
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
    // var that = this
    // wx.getStorage({
    //   key: api.SESSION_ID,
    //   success: function(res) {
    //     that.getExpenseList(that)
    //   },
    //   fail: function(res) {
    //     that.gotoLogin("")
    //   }
    // })
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
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    api.request({
      url: API_SEARCH,
      method: "POST",
      data: {},
      header: {
        WechatAccessToken: null
      },
      success(res) {
        console.log(res.data)
        var listData = []
        if (typeof(res.data.data) == typeof(undefined) || res.data.code !=
          0) {
          that.onNetworkFail()
        } else {
          res.data.data.forEach(v => {
            listData.push({
              title: v.description,
              date: typeof(v.submittedDate) == typeof(undefined) ? "--" : util.formatDate(new Date(v.submittedDate)),
              status: v.status,
              totalAmount: util.formatAmountEasy(v.totalAmount),
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
      },
      complete(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
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
    wx.hideLoading()
    wx.showToast({
      title: 'Server error',
      icon: 'none',
      duration: 2000
    })

  },

  //下拉刷新
  onPullDownRefresh: function(e) {
    var that = this
    wx.getStorage({
      key: api.SESSION_ID,
      success: function(res) {
        that.setData({
          isShowExitBtn:'display'
        })
        that.getExpenseList(that)
      },
      fail: function(res) {
        // that.gotoLogin("")
        that.setData({
          isShowExitBtn: 'none'
        })
      }
    })
  },

  onShow(e) {
    var that = this
    wx.getStorage({
      key: api.SESSION_ID,
      success: function(res) {
        that.setData({
          isShowExitBtn: 'display'
        })
        that.getExpenseList(that)
      },
      fail: function(res) {
        that.setData({
          isShowExitBtn: 'none'
        })
      }
    })
  },

  exitProfile(e) {
    this.setData({
      isShowExitDialog: true,
    })
  },

  tapExitDialogButton(e) {
    this.setData({
      isShowExitDialog: false,
    })
    if (e.detail.index == 1) {
      this.exitAccount()
    }
  },

  exitAccount() {
    var that = this
    wx.clearStorage({
      success: function(res) {
        that.gotoLogin("")
      },
      fail: function(res) {
        that.gotoLogin("")
      }
    })
  },

  loginOrdo(fun){
    var that = this
    wx.getStorage({
      key: api.SESSION_ID,
      success: function (res) {
       fun()
      },
      fail: function (res) {
        that.gotoLogin("")
      }
    })
  },

  addInvoiceOrLogin(e){
    this.loginOrdo(this.addInvoice)
  }

})