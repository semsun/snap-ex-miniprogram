// pages/me/me.js
const util = require('../../utils/util.js')
var api = require('../../utils/authRequest.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShowExitDialog: false,
    isShowExitBtn: 'none',
    isNeedLogin: true,
    buttons: [{
      text: 'Cancel'
    }, {
      text: 'Yes'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow(e) {
    this.getLoginStatus()
  },

  getLoginStatus() {
    var that = this
    wx.getStorage({
      key: api.SESSION_ID,
      success: function(res) {
        that.changeViewByLoginStatus(true, that)
      },
      fail: function(res) {
        that.changeViewByLoginStatus(false, that)
      }
    })
  },

  changeViewByLoginStatus(loginStatus, self) {
    self.setData({
      isNeedLogin: !loginStatus,
      isShowExitBtn: loginStatus ? 'display' : 'none'
    })
  },

  exitProfile(e) {
    // this.setData({
    //   isShowExitDialog: true,
    // })
    let _this = this
    wx.showModal({
      title: '确认解绑 Confirm',
      content: '确定要解绑微信吗？\r\nAre you sure to unassociate?',
      showCancel: true,
      cancelText: "否 No",
      cancelColor: "#333333",
      confirmText: "是 Yes",
      confirmColor: "#DB0011",
      success: function(e) {
        if (e.cancel) {
          console.log("Click No")
        }
        if (e.confirm) {
          console.log("Click Yes")
          _this.exitAccount()
        }
      }
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
      complete: function(res) {
        that.getLoginStatus()
      }
    })
  },

  gotoLogin: function(e) {
    wx.navigateTo({
      url: '/pages/Login/Login',
    })
  },

  todoFun(e) {
    wx.showToast({
      title: 'Coming soon!',
      icon: 'none',
      duration: 2000
    })
  },

  genralFun(e) {
    wx.navigateTo({
      url: '/pages/general/general',
    })
  }

})