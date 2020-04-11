// pages/requestPage/addRequest.js
var inputRequestName = ""

Page({


  /**
   * 页面的初始数据
   */
  data: {
    ctaDisable: true,
  },

  addRequest(e) {
    console.log(inputRequestName)
    var param = {
      isAdd: true,
      inputRequestName: inputRequestName
    }
    wx.navigateTo({
      url: '/pages/requestPage/requestPage?json=' + JSON.stringify(param),
    })
  },


  inputRequestName: function(e) {
    inputRequestName = e.detail.value
    if (e.detail.value.length > 0) {
      this.setData({
        ctaDisable: false,
      })
    } else {
      this.setData({
        ctaDisable: true,
      })
    }
  },
})