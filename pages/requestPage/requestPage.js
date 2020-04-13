// pages/requestPage/requestPage.js
let app = getApp()
let api = require('../../utils/authRequest.js')
let util = require('../../utils/util.js')

let item_add = {
  purposeId: -1, //add invoice id
  description: 'Add invoice or evidence',
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReadySubmit: false,
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
    ctaContent: "提交 Submit"
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
  },

  //显示页面的时候
  onShow(e) {
    this.getPurposeData(this, this.data.expenseId)
  },

  addInvoice: function() {
    var that = this
    wx.navigateTo({
      url: '/pages/purpose/purpose?editFlag=true&expenseId=' + that.data.expenseId,
    })
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

        let isSubmitable = res.data.status == 0
        var tempPageData = {
          purposeDescription: res.data.description,
          totalAmount: util.formatAmountEasy(res.data.totalAmount)
        }
        if (isSubmitable) {
          res.data.purposes.push(item_add)
        }
        tempPageData.item = res.data.purposes.map(function(value, index, array) {
          switch (value.purposeId) {
            case -1:
              value.icon = "/images/icons/add.png"
              value.purposeDesc = '添加票据'
              break
            case 1:
              value.icon = "/images/icons/traffic-selected.png"
              value.purposeDesc = '交通 Travel ticket'
              break
            case 17:
              value.icon = "/images/icons/dinner-selected.png"
              value.purposeDesc = '餐饮 Dinner'
              break
            case 7:
              value.icon = "/images/icons/training-selected.png"
              value.purposeDesc = '培训 Training'
              break
            case 8:
              value.icon = "/images/icons/teambuilding-selected.png"
              value.purposeDesc = '团建 Team building'
              break
            case 11:
              value.icon = "/images/icons/entertainment-selected.png"
              value.purposeDesc = '娱乐 Entertainment'
              break
            case 13:
              value.icon = "/images/icons/more-selected.png"
              value.purposeDesc = '其它 Others'
              break
            default:
              value.icon = "/images/icons/more-selected.png"
              value.purposeDesc = ''
          }
          if (value.purposeId != -1) {
            value.amount = util.formatAmountEasy(value.amount)
          }
          return value
        })

        that.setData({
          pageData: tempPageData,
          isShowListView: 'display',
          ctaContent: isSubmitable ? '提交 Submit' : '已提交 Submitted',
          isReadySubmit: isSubmitable && res.data.totalAmount > 0 ? true : false
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
    if (!this.data.isReadySubmit) {
      return
    }
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
    if (e.mark.itemdata.purposeId == -1) {
      this.addInvoice()
    } else {
      wx.navigateTo({
        url: '/pages/purpose/purpose?expenseId=' + e.mark.itemdata.expenseId +
          '&expenseDetailId=' + e.mark.itemdata.expenseDetailId,
      })
    }
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
          // wx.navigateBack({
          //   delta: 1
          // })
          wx.redirectTo({
            url: '/pages/summitResult/summitResult',
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