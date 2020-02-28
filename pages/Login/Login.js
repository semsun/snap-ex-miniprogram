// pages/Login/Login.js
const app = getApp()
const api = require('../../utils/authRequest.js')

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    security_key: '',
    openId: '',
    mail: '',
    name: '',
    sid: '',
    qrCodeResult: '',
    loginBtnDisabled: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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

    if(options) {
      var omail = options.mail
      var osid = options.sid
      if(osid) osid = osid.trim()

      var oname = ''
      if(omail && omail.length > 0) {
        oname = omail.trim().split('@')[0]
      }
      this.setData({
        mail:omail,
        sid:osid,
        name:oname
      })
    }
    
    // wx.login({
    //   success: function (res) {
    //     console.log(res.code);
    //     wx.request({
    //       url: 'http://39.108.227.233/user/register',
    //       method: 'POST',
    //       data: {
    //         "code": res.code,
    //         "username": "34052468",
    //         "userId": "USER01"
    //       },
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       success(res) {
    //         console.log(res.data)
    //       }
    //     })
    //   }
    // })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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

  scanQRCodeLogin: function() {
    var _this = this

    _this.setData({ loginBtnDisabled: true})

    wx.showLoading({
      title: 'Logining...',
    })
    setTimeout(function () {
      if(_this.data.loginBtnDisabled) {
        wx.hideLoading()
        _this.setData({ loginBtnDisabled: false })
      }
    }, 10000)

    wx.scanCode({
      success: function(res) {
        console.log(res);
        _this.setData({qrCodeResult:res.result})
        wx.login({
          success: function(res) {
            wx.request({
              url: api.REG_URL,
              method: 'POST',
              data: {
                "code": res.code,
                "hashKey": _this.data.qrCodeResult
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res)

                if (res.data.WechatAccessToken) {
                  wx.setStorage({
                    key: api.SESSION_ID,
                    data: res.data.WechatAccessToken,
                    success: function (res) {
                      wx.redirectTo({
                        url: '/pages/index/index',
                      })
                    },
                    fail: function (res) {
                      console.log("Set storage failed!")
                      if (_this.data.loginBtnDisabled) {
                        wx.hideLoading()
                        _this.setData({ loginBtnDisabled: false })
                      }
                      wx.showModal({
                        title: "Local Error",
                        content: 'Access local storage failed',
                        showCancel: false
                      })
                    }
                  })
                } else {
                  if (_this.data.loginBtnDisabled) {
                    wx.hideLoading()
                    _this.setData({ loginBtnDisabled: false })
                  }
                  var errMsg = res.errmsg ? res.errmsg : res.message
                  wx.showModal({
                    title: "Login Error",
                    content: errMsg,
                    showCancel: false
                  })
                }
              },
              fail: function (res) {
                console.log("login failed!")
                if (_this.data.loginBtnDisabled) {
                  wx.hideLoading()
                  _this.setData({ loginBtnDisabled: false })
                }
                wx.showModal({
                  title: "Server Error",
                  content: 'Login failed:' + JSON.stringify(res),
                  showCancel: false
                })
              }
            })
          }
        })
      }
    })

  },

  login: function(e) {
    var that = this
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var errMsg = e.detail.errMsg
    console.log(ency);
    if (iv == null || ency == null) {
      wx.showToast({
        title: "授权失败,请重新授权！",
        icon: 'none',
      })
      return false
    }
    
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})