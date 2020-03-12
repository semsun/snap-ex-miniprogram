// pages/Invoice/InvoicePage.js
const app = getApp()
const api = require('../../utils/authRequest.js')
const util = require('../../utils/util.js')

const ID_PARAM = "[purposeId]"
const TOKEN = "[accessToken]"
const API_ADD_PURPOSE = app.globalData.host + "/expense/purpose/add"
const API_UPLOAD_INVOICE_IMG = app.globalData.host + "/invoice/" + ID_PARAM + "/upload"
const API_ADD_INVOICE = app.globalData.host + "/invoice/add"
const API_QUERY_INVOICE = app.globalData.host + "/invoice/" + ID_PARAM
const API_QUERY_INVOICE_IMG = app.globalData.host + "/invoice/" + ID_PARAM + "/image?accessKey=" + TOKEN
const API_QUREY_PURPOSE = app.globalData.host + "/expense/purpose/" + ID_PARAM

Page({

  /**
   * Page initial data
   */
  data: {
    currencyIndex: 0,
    currencyArray: ["CNY", "USD"], 
    purposeArray: ["Team Building", "Taffic", "Hotal", "Food", "Training", "Travel"],

    purpose: {
      code: "12345",
      number: "98765",
      purposeId: 0, /* 0: Team Build; 1: Taffic; 2: Room; 3: Food; 4:Training; 5: Travel */
      companyName: "",
      occurDate: "",
      currency: "CNY",
      amount: 0,
      amountCNY: 0,
      currencyRateCNY: 0.8,
      expenseDetailId: null,
      expenseId: "",
      invoiceId: "",
      purposeName: "",
      description: "",
      image_path: ""
    },
    purpose_array: [
      { purpose: "Training" },
      { purpose: "Team Building" },
      { purpose: "Business Travel" },
      { purpose: "HR Allowance" },
      { purpose: "Corporate Sustainability" },
      { purpose: "Entertainment" },
      { purpose: "Driver Expenses" },
      { purpose: "Low Value Purchase" },
      { purpose: "Offsite meeting" },
      { purpose: "IT Transformation" },
      { purpose: "Courier fee" },
      { purpose: "QCPG" },
      { purpose: "Others" }
    ],
    categorys: [
      {
        icon_normal: "/images/icons/teambuild_normal.png",
        icon_selected: "/images/icons/teambuild_selected.png",
        name: "Team Build"
      },
      {
        icon_normal: "/images/icons/bus_normal.png",
        icon_selected: "/images/icons/bus_selected.png",
        name: "Traffic"
      },
      {
        icon_normal: "/images/icons/house_normal.png",
        icon_selected: "/images/icons/house_selected.png",
        name: "Hotel"
      },
      {
        icon_normal: "/images/icons/meat_normal.png",
        icon_selected: "/images/icons/meat_selected.png",
        name: "Food"
      },
      {
        icon_normal: "/images/icons/training_normal.png",
        icon_selected: "/images/icons/training_selected.png",
        name: "Training"
      },
      {
        icon_normal: "/images/icons/travel_normal.png",
        icon_selected: "/images/icons/travel_selected.png",
        name: "Travel"
      }
    ],
    purpose_index: 0,
    sel_pho_btn_title: "Select Picture",
  },
  bindPickerChange_purpose: function (e) {
    console.log('picker send change, value:', e.detail.value);
    this.setData({
      purpose_index: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
    console.log('cunstom value:', this.data.purpose_index);
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var _this = this

    var expenseId = options.expenseId
    var expenseDetailId = options.expenseDetailId
    // this.setData({ ['purpose.expenseDetailId']: util.generateId(5) })

    if( expenseDetailId ) {
      var queryUrl = API_QUREY_PURPOSE.replace(ID_PARAM, expenseDetailId)
      wx.showLoading({
        title: 'Load...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 10000)
      api.request({
        url: queryUrl,
        method: "GET",
        header: {
          WechatAccessToken: null
        },
        success: function(res) {
          console.log(res)
          if(0 == res.data.code && res.data.data) {
            _this.setData({ purpose: res.data.data })
            _this.setData({ ["purpose.expenseDetailId"]: expenseDetailId }) // return is expenseDetailId
            _this.setData({ ["purpose.expenseId"]: expenseId })
            var iPurpose = util.findIndexInArray(_this.data.purposeArray, _this.data.purpose.purposeName)
            var iCurrency = util.findIndexInArray(_this.data.currencyArray, _this.data.purpose.currency)
            _this.setData({
              ["purpose.purposeId"]: iPurpose,
              currencyIndex: iCurrency
            })

            _this.queryInvoiceImage(_this.data.purpose.invoiceId)
            // _this.queryInvoiceImage("XiAKPXxhRBTgOEyzJIgTIFpUhmoLDIdU")
          }
          wx.hideLoading()
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      console.log("New Purpose")
      _this.setData({ ['purpose.occurDate']: util.formatDate(new Date) })
      _this.setData({ ["purpose.expenseId"]: expenseId })
      _this.setData({ ["purpose.purposeName"]: _this.data.purposeArray[0]})
    }

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
  changeCategory: function (e) {
    var $tmp = e.currentTarget.dataset.id;
    // let query = wx.createSelectorQuery().in(this);
    // query.select('.icon_size');
    // query.exec(function(res){
    //   console.log(res.dataset.id);
    // })
    console.log($tmp);
    this.setData({ ['purpose.purposeId']: $tmp })
    this.setData({ ['purpose.purposeName']: this.data.purposeArray[$tmp]})
  },

  addPurpose: function (e) {
    var _this = this

    wx.showLoading({
      title: 'Saving...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 50000)

    var newPurposeUrl = "/pages/purpose/purpose?expenseId=" + _this.data.purpose.expenseId

    this.addInvoice({
      success: function (res) {
        wx.redirectTo({
          url: newPurposeUrl,
        })
      }
    })
    // wx.scanCode({
    //   success: (res) => {
    //     var strArr = res.result.split(',');
    //     console.log(strArr);
    //     this.setData({
    //       purpose: {
    //         code: strArr[2],
    //         number: strArr[3],
    //         date: strArr[5],
    //         amount: parseFloat(strArr[4])
    //       }
    //     })

    //     var param = JSON.stringify(this.data.purpose);
    //     console.log(param);
    //     wx.redirectTo({
    //       url: '/pages/Invoice/InvoicePage?json=' + param,
    //     })
    //   }
    // })
  },

  bindCurrencyChange(e) {
    var _this = this
    this.setData({
      ['purpose.currency']: _this.data.currencyArray[e.detail.value],
      currencyIndex: e.detail.value
    })
  },

  updateAmount: function (e) {
    this.setData({
      ['purpose.amount']: e.detail.value
    })
  },

  bindDateChange(e) {
    this.setData({
      ['purpose.occurDate']: e.detail.value
    })
  },

  bindDescriptionChange: function (e) {
    this.setData({
      ['purpose.description']: e.detail.value
    })
  },

  saveAction: function () {
    var _this = this

    wx.showLoading({
      title: 'Saving...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 50000)

    // this.addInvoice({success: function(res) {
    this.savePurpose({success: function(res) {
      wx.navigateBack()
    }})
  },

  savePurpose: function (param) {
    var _this = this
    console.log("Save Purpose")
    api.request({
      url: API_ADD_PURPOSE,
      method: "POST",
      header: {
        WechatAccessToken: null
      },
      data: _this.data.purpose,
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          var expenseDetailId = res.data.data.expenseDetailId
          _this.setData({ ["purpose.expenseDetailId"]: expenseDetailId })
          _this.setData({ ["purpose.invoiceId"]: res.data.data.invoiceId})
          if (_this.data.purpose.image_path) {
            _this.uploadImage(param);
          }
          // 保存成功后操作
          if (!_this.data.purpose.image_path) {
            // Purpose 保存成功
            wx.hideLoading()
            wx.showModal({
              title: 'Save Success',
              content: "Purpose saved successful!",
              showCancel: false,
              success: param.success,
              confirmText: "OK"
            })
          }
        } else {
          // 保存失败
          wx.hideLoading()
          wx.showModal({
            title: 'Save Error',
            content: res.data.msg,
            showCancel: false,
            confirmText: "OK"
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: 'Save Error',
          content: res.errMsg,
          showCancel: false,
          confirmText: "OK"
        })
      }
    })
  },
  uploadImage(param) {
    console.log("Upload Image")
    var _this = this
    var _image_path = _this.data.purpose.image_path[0]
    var invoiceId = _this.data.purpose.invoiceId
    console.log("ImagePath: " + _image_path)
    // Purpose 保存成功后，上传 invoice 图片
    var upload_url = API_UPLOAD_INVOICE_IMG.replace(ID_PARAM, invoiceId)
    console.log(upload_url)
    api.uploadFile({
      url: upload_url,
      filePath: _image_path,
      name: "invoice",
      header: {
        WechatAccessToken: null,
      },
      formData: {
        invoiceId: invoiceId
      },
      success: function (res) {
        console.log("[UploadFile]" + JSON.stringify(res.data))
        var data = JSON.parse(res.data)

        // 上传图片成功
        if (data.code == 0) {
          wx.hideLoading()
          wx.showModal({
            title: 'Save Successful',
            content: "Purpose with images saved successfull!",
            showCancel: false,
            success: param.success,
            confirmText: "OK"
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: 'Save Error',
            content: "Purpose have saved, but invoice upload return failed!",
            showCancel: false,
            confirmText: "OK"
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: 'Upload Invoice Error',
          content: "Purpose have saved, but invoice picture upload failed!",
          showCancel: false,
          confirmText: "OK"
        })
      }
    })
  },
  addInvoice(param) {
    var _this = this
    console.log("Add invoice")
    api.request({
      url: API_ADD_INVOICE,
      method: "POST",
      header: {
        WechatAccessToken: null
      },
      data: {},
      success: function(res) {
        console.log("[ADD INVOICE SUCCESS]" + res)
        // 新增 invoice 成功，使用 invoice 关联上传图片
        if (res.data.code == 0) {
          _this.setData({ ["purpose.invoiceId"]: res.data.data.invoiceId })
          // 获取到 InvoiceId 后，带入 purpose 并保存。
          _this.savePurpose(param);
        }
      },
      fail: function(res) {
        console.log("[ADD INVOICE FAILED]" + res)
        wx.hideLoading()
        wx.showModal({
          title: 'Upload Invoice Error',
          content: res.data.msg,
          showCancel: false,
          confirmText: "OK"
        })
      }
    })
  },
  takeInvoicePhoto() {
    console.log("click take pricture")
    var _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _this.setData({
          ['purpose.image_path']: tempFilePaths,
          sel_pho_btn_title: "Change Picture"
        })
      }
    })
  },

  queryInvoiceImage(invoiceId) {
    var _this = this
    var invoicde_url = API_QUERY_INVOICE.replace(ID_PARAM, invoiceId)
    api.request({
      url: invoicde_url,
      method: "GET",
      header: {
        WechatAccessToken: null
      },
      success: function (res) {
        console.log(res)
        
        if (res.data.code == 0) {
          var imagePath = API_QUERY_INVOICE_IMG.replace(ID_PARAM, invoiceId).replace(TOKEN, res.data.data.accessKey)
          console.log(imagePath)

          _this.setData({ ["purpose.image_path"]: imagePath })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: 'Get Image Error',
            content: res.data.msg,
            showCancel: false,
            confirmText: "OK"
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: 'Get Image Error',
          content: JSON.stringify(res),
          showCancel: false,
          confirmText: "OK"
        })
      }
    })
    // api.getAuthCode({
    //   success: function (code) {
    //     var imagePath = API_QUERY_INVOICE_IMG.replace(ID_PARAM, purposeId).replace(TOKEN, code)
    //     console.log(imagePath)

    //     _this.setData({ ["purpose.image_path"]: imagePath })
    //   }
    // })
  }
})