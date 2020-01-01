// pages/Invoice/invoiceDetail/invoiceDetail.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    var context = wx.createCanvasContext('invoicePage')

    // context.setStrokeStyle("#00ff00")
    // context.setLineWidth(5)
    let x = 2
    let y = 50
    let w = 370
    let h = 200
    context.stroke()
    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.rect(x, y, w, h)
    // context.stroke()
    // context.setStrokeStyle("#ff0000")
    // context.setLineWidth(2)
    // context.moveTo(160, 100)
    // context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    // context.moveTo(140, 100)
    // context.arc(100, 100, 40, 0, Math.PI, false)
    // context.moveTo(85, 80)
    // context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    // context.moveTo(125, 80)
    // context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    // context.stroke()

    context.setLineWidth(1)
    let y1 = y + h / 19 * 4
    context.moveTo(x, y1)
    context.lineTo(x + w, y1)

    let y2 = y + h / 19 * 13
    context.moveTo(x, y2)
    context.lineTo(x + w, y2)

    let y3 = y + h / 19 * 15
    context.moveTo(x, y3)
    context.lineTo(x + w, y3)

    let x1 = x + w / 37
    context.moveTo( x1, y )
    context.lineTo( x1, y1 )

    context.moveTo(x1, y3)
    context.lineTo(x1, y + h)

    let x2 = x + w / 37 * 7
    context.moveTo(x2, y1)
    context.lineTo(x2, y3)

    let x3 = x + w / 37 * (7 + 4)
    context.moveTo(x3, y1)
    context.lineTo(x3, y2)

    let x4 = x + w / 37 * (7 + 7)
    context.moveTo(x4, y1)
    context.lineTo(x4, y2)

    let x5 = x + w / 37 * (7 + 12)
    context.moveTo(x5, y1)
    context.lineTo(x5, y2)

    let x6 = x + w / 37 * (7 + 17)
    context.moveTo(x6, y1)
    context.lineTo(x6, y2)

    let x7 = x + w / 37 * (7 + 23)
    context.moveTo(x7, y1)
    context.lineTo(x7, y2)

    let x8 = x + w / 37 * (7 + 25)
    context.moveTo(x8, y1)
    context.lineTo(x8, y2)

    let x9 = x + w / 7 * 4
    context.moveTo(x9, y)
    context.lineTo(x9, y1)

    context.moveTo(x9, y3)
    context.lineTo(x9, y + h)

    let x10 = x + w / 7 * 4 + w / 37
    context.moveTo(x10, y)
    context.lineTo(x10, y1)

    context.moveTo(x10, y3)
    context.lineTo(x10, y + h)
    
    context.stroke()
    context.draw()
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

  }
})