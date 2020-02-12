//index.js
//获取应用实例
const app = getApp()
var authRequest = require('../../utils/authRequest.js')

Page({
  data: {
    motto: 'Hello World',
    test: {
      a: "aa",
      b: "bb"
    },
    sr: "Test",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function(scanResult) {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(authRequest)
    console.log(authRequest.test1({value:"indes"}))

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
  testBtn: function(e) {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        wx.showModal({
          title: 'Scan Result',
          content: res.result,
          showCancel: false
        })
      }
    })
  },
  toTestPage: function(e) {
    wx.navigateTo({
      url: '/pages/claimForm/claimForm',
    })
  },

  toLogin: function (e) {
    wx.navigateTo({
      url: '/pages/Login/Login?mail=test@bank.com&sid=2345678',
    })
  },
  
  toInvoice: function(e) {
    // wx.setStorageSync("tmpData", "DataFromIndex");
    var tmpData = JSON.stringify({
      "code": "044001600111",
      "number": "37669836",
      "date": "20170902",
      "category": 0,
      "amount": 12.74
    })
    console.log("toJson:" + tmpData)
    wx.navigateTo({
      url: '/pages/Invoice/InvoicePage?json=' + tmpData,
    })
  },
  toInvoiceType: function(e) {
    // wx.setStorageSync("tmpData", "DataFromIndex");
    wx.navigateTo({
      url: '/pages/Invoice/invoiceList/invoiceList',
    })
  },
  popButton: function(e) {
    wx.navigateTo({
      url: '/pages/popButton/popButton',
    })
  },
  toHome: function(e) {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  toDashboard: function(e) {
    wx.navigateTo({
      url: '/pages/dashboard/dashboard',
    })
  },

  toRequestPage: function(e) {
    wx.navigateTo({
      url: '/pages/requestPage/requestPage',
    })
  },

  toHuaTuo: function (e) {
    // wx.navigateTo({
    //   url: '/pages/HuaTuo/survey',
    // })
    // wx.request({
    //   url: 'http://service.snapex.xyz:8090/snapex/expense/search', //仅为示例，并非真实的接口地址
    //   method: 'POST',
    //   data: {
    //     "expenseId": "E0000001"
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })

    wx.login({
      success: function (res) {
        console.log(res.code);
        wx.request({
          url: 'http://192.168.0.102:8080/mini_program', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            "code": res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)

            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                console.log(res)
              },
              fail: function (res) {
                console.log(res)
              }
            })

          }
        })
      }
    })

  }
})