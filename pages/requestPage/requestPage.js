// pages/requestPage/requestPage.js
const app = getApp()
var api = require('../../utils/authRequest.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdd: true,
    expenseId: "",
    btnContext: "Save",
    inputRequestName: "",
    btnIsLoading: false,
    isShowSubmitBtn: 'none',
    isShowListView: 'none',
    pageData: {
      purposeDescription: "",
      totalAmount: "",
      item: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var param = JSON.parse(options.json)
    console.log(param)
    var isAdd_t = typeof(param.isAdd) != typeof(undefined) ? param.isAdd : true

    this.setData({
      isAdd: isAdd_t,
      btnContext: isAdd_t ? "Save" : "Add",
      expenseId: param.expenseId,
      isShowSubmitBtn: (!isAdd_t && param.purposeStatus == 0) ? 'show' : 'none'
    })
    if (!isAdd_t) {
      this.getPurposeData(this, param.expenseId)
    }
  },

  addInvoice: function(e) {
    var that = this
    wx.navigateTo({
      // url: '/pages/purpose/purpose?expenseId=test003&expenseDetailId=IeIErjVaGe',
      url: '/pages/purpose/purpose?expenseId=' + that.data.expenseId,
    })
  },

  onBtnClick: function(e) {
    var that = this
    if (this.data.isAdd) {
      this.setData({
        btnIsLoading: true
      })
      wx.showLoading({
        title: 'Loading',
        mask: true
      })
      //新增request name
      //call pao gor api,success then will change btn context to "Add"
      api.request({
        url: app.globalData.host + ":" + app.globalData.port + "/expense/savedraft",
        method: "POST",
        data: {
          "staffId": app.globalData.staffId,
          "description": that.data.inputRequestName,
          "status": 0
        },
        header: {
          WechatAccessToken: null
        },
        success(res) {
          console.log(res.data)
          if (res.data.status == 'SUCCESS') {
            that.setData({
              expenseId: res.data.message,
              isAdd: false,
              btnContext: "Add",
              pageData: {
                purposeDescription: that.data.inputRequestName,
                totalAmount: "0.00",
                item: []
              },
            })
          } else {
            that.onNetworkFail()
          }
        },
        fail(res) {
          that.onNetworkFail()
          console.log(res)
        },
        complete(res) {
          that.setData({
            btnIsLoading: false
          })
          wx.hideLoading()
        }
      })
    } else {
      //新增invoice
      this.addInvoice(e)
    }
  },

  getPurposeData: function(that, expenseId) {
    api.request({
      url: app.globalData.host + ":" + app.globalData.port + "/expense/" + expenseId + "/detail",
      header: {
        WechatAccessToken: null
      },
      success(res) {
        console.log(res.data)
        var tempPageData = {
          purposeDescription: res.data.item.description,
          totalAmount: res.data.item.totalAmount
        }
        //todo 判断有无invoice invoice list
        var tempIsHasInvoiceListData = 'none'
        that.setData({
          pageData: tempPageData,
          isShowListView: tempIsHasInvoiceListData
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  submitPurpose: function(that) {

  },

  inputRequestName: function(e) {
    this.data.inputRequestName = e.detail.value
  },

  onNetworkFail() {
    wx.showToast({
      title: 'Server error',
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })
  }
})