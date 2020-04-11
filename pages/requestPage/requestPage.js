// pages/requestPage/requestPage.js
let app = getApp()
let api = require('../../utils/authRequest.js')
let util = require('../../utils/util.js')

let item_add = {
  purposeId: -1, //add invoice id
  purposeDesc: '添加票据',
  description: 'Add invoice or evidence',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expenseId: "",
    btnSumitIsLoading: false,
    isShowListView: 'none',
    dialogShow: false,
    isShowSubmitBtn: 'show',
    buttons: [{
      text: 'Cancel'
    }, {
      text: 'Yes'
    }],
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
    let inputRequestName = typeof(param.inputRequestName) != typeof(undefined) ? param.inputRequestName : ""
    this.setData({
      isShowSubmitBtn: (param.purposeStatus == 0) ? 'display' : 'none',
      purposeStatus: param.purposeStatus,
      expenseId: param.expenseId
    })
    this.getPurposeData(this, param.expenseId)

  },

  addInvoice: function(e) {
    var that = this
    wx.navigateTo({
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
        url: app.globalData.host + "/expense/savedraft",
        method: "POST",
        data: {
          "description": that.data.inputRequestName,
          "status": 0
        },
        header: {
          WechatAccessToken: null
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == 0) {
            that.setData({
              purposeStatus: 0,
              expenseId: res.data.id,
              isAdd: false,
              btnContext: "Add purpose",
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

  //获取purpose data
  getPurposeData: function(that, expenseId) {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    api.request({
      url: app.globalData.host + "/expense/" + expenseId + "/detail",
      header: {
        WechatAccessToken: null
      },
      success(res) {
        console.log(res.data)
        if (res.data.code != 0) {
          that.onNetworkFail()
        }

        res.data = res.data.data

        let isCanSubmit = res.data.status == 0
        var tempPageData = {
          purposeDescription: res.data.description,
          totalAmount: util.formatAmountEasy(res.data.totalAmount)
        }
        if (isCanSubmit) {
          res.data.purposes.push(item_add)
        }
        tempPageData.item = res.data.purposes.map(function(value, index, array) {
          switch (value.purposeId) {
            case -1:
              value.icon = "/images/icons/teambuild_selected.png"
              break
            case 0:
              value.icon = "/images/icons/teambuild_selected.png"
              break
            case 1:
              value.icon = "/images/icons/bus_selected.png"
              break
            case 2:
              value.icon = "/images/icons/house_selected.png"
              break
            case 3:
              value.icon = "/images/icons/meat_selected.png"
              break
            case 4:
              value.icon = "/images/icons/training_selected.png"
              break
            case 5:
              value.icon = "/images/icons/travel_selected.png"
              break
            default:
              value.icon = "/images/icons/teambuild_selected.png"
          }
          if (value.purposeId != -1) {
            value.amount = util.formatAmountEasy(value.amount) +' CNY'
          }
          return value
        })

        that.setData({
          pageData: tempPageData,
          isShowListView: 'display',
          isShowSubmitBtn: isCanSubmit ? 'display' : 'none'
        })
      },
      fail(res) {
        console.log(res)
        that.onNetworkFail()
      },
      complete(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  submitPurpose: function(that) {
    this.setData({
      dialogShow: true
    })
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
  },

  onItemClick: function(e) {
    wx.navigateTo({
      // url: '/pages/purpose/purpose?expenseId=test003&expenseDetailId=IeIErjVaGe',
      url: '/pages/purpose/purpose?expenseId=' + e.mark.itemdata.expenseId +
        '&expenseDetailId=' + e.mark.itemdata.expenseDetailId,
    })
  },

  onPullDownRefresh(e) {
    if (!this.data.isAdd) {
      this.getPurposeData(this, this.data.expenseId)
    }
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
    })
    if (e.detail.index == 1) {
      this.callSubmitRequest()
    }
  },

  callSubmitRequest() {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    var that = this
    this.setData({
      btnSumitIsLoading: true
    })
    api.request({
      url: app.globalData.host + "/expense/" + this.data.expenseId + "/submit",
      method: "POST",
      data: {},
      header: {
        WechatAccessToken: null
      },
      success(res) {
        console.log(res.data)
        var result = res.data
        if (result.code == 0) {
          wx.navigateBack({
            delta: 1
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
          btnSumitIsLoading: false
        })
        wx.hideLoading()
      }
    })
  }

})