// pages/general/general.js
var storage = require('../../utils/storage.js')

let locationViewModel = [{
    index: 0,
    key: 0,
    value: "Guangzhou"
  },
  {
    index: 1,
    key: 1,
    value: "Xi'An"
  },
  {
    index: 2,
    key: 3,
    value: "Shanghai ODC"
  },
  {
    index: 3,
    key: 4,
    value: "Pactera"
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationIndex: 0,
    locationData: ["Guangzhou", "Xi'An", "Shanghai ODC", "Pactera"],
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.getStorage({
      key: storage.CONFIG_LOCATION,
      success: function(res) {
        _this.setData({
          locationIndex: res.data.index
        })
      },
      fail: function(res) {
        _this.setData({
          locationIndex: 0
        })
      }
    })

  },

  bindLocationChange(e) {
    let _this = this
    this.setData({
      locationIndex: e.detail.value
    })
  },

  saveAction(e) {
    let _this = this
    wx.setStorage({
      key: storage.CONFIG_LOCATION,
      data: locationViewModel[_this.data.locationIndex],
      success: function(e) {
        wx.showToast({
          title: 'Save successful',
          icon: 'none', //如果要纯文本，不要icon，将值设为'none'
          duration: 2000
        })
        setTimeout(function() {
          //要延时执行的代码
          wx.navigateBack({
            delta: -1
          });
        }, 1000) //延迟时间 这里是1秒 
      },
      fail: function(e) {
        wx.showToast({
          title: 'Save fail',
          icon: 'none', //如果要纯文本，不要icon，将值设为'none'
          duration: 2000
        })
      }
    })
  }



})