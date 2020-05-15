// pages/requestPage/addRequest.js
let app = getApp()
let api = require('../../utils/authRequest.js')
let util = require('../../utils/util.js')
var inputRequestName = ""

Page({


  /**
   * 页面的初始数据
   */
  data: {
    ctaDisable: true,
    ctaIsLoading: false
  },

  addRequest(e) {
    if (this.data.ctaDisable) {
      return
    }
    let _this = this
    this.setData({
      ctaIsLoading: true
    })
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    //新增request name
    //call pao gor api,success then will change btn context to "Add"
    api.request({
      url: app.globalData.host + "/expense/savedraft",
      method: "POST",
      data: {
        "description": inputRequestName,
        "status": 0
      },
      header: {
        WechatAccessToken: null
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 0) {
          _this.addRequest_successful(res.data.data.expenseId)
        } else {
          _this.onNetworkFail()
        }
      },
      fail(res) {
        _this.onNetworkFail()
        console.log(res)
      },
      complete(res) {
        _this.setData({
          ctaIsLoading: false
        })
        wx.hideLoading()
      }
    })
  },


  addRequest_successful(expenseId) {
    console.log(inputRequestName)
    var param = {
      isAdd: true,
      inputRequestName: inputRequestName,
      expenseId: expenseId
    }
    wx.redirectTo({
      url: '/pages/requestPage/requestPage?json=' + JSON.stringify(param),
    })
  },


  inputRequestName: function(e) {
    inputRequestName = e.detail.value
    if ((e.detail.value).trim().length > 0) {
      this.setData({
        ctaDisable: false,
      })
    } else {
      this.setData({
        ctaDisable: true,
      })
    }
  },

  onNetworkFail() {
    wx.showToast({
      title: 'Server error',
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })
  },
})