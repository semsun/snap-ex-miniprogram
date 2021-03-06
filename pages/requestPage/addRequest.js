// pages/requestPage/addRequest.js
let app = getApp()
let api = require('../../utils/authRequest.js')
let util = require('../../utils/util.js')
var inputRequestName = ""
var inputCostCentreNum = ""
var isInputTitleValid = false
var isBillableValid = false

Page({


  /**
   * 页面的初始数据
   */
  data: {
    ctaDisable: true,
    ctaIsLoading: false,
    isBillable: -1
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
        "status": 0,
        "billable": _this.data.isBillable,
        "customerCostCentreNo": inputCostCentreNum
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
      isInputTitleValid = true
      this.isCtaVaild()
    } else {
      isInputTitleValid = false
      this.isCtaVaild()
    }
  },

  inputCentreNum: function(e) {
    inputCostCentreNum = e.detail.value
    if ((e.detail.value).trim().length > 0) {
      isBillableValid = true
      this.isCtaVaild()
    } else {
      isBillableValid = false
      this.isCtaVaild()
    }
  },

  setBillableStatus: function(e) {
    this.setData({
      isBillable: 1,
    })
    this.isCtaVaild()
  },

  setUnbillableStatus: function(e) {
    this.setData({
      isBillable: 2,
    })
    this.isCtaVaild()
  },

  isCtaVaild: function() {
    let _ctaDisable = !(isInputTitleValid & (this.data.isBillable > 0))
    this.setData({
      ctaDisable: _ctaDisable,
    })
  },


  onNetworkFail() {
    wx.showToast({
      title: 'Server error',
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })
  },
})