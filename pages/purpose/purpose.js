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
const API_DEL_PURPOSE = app.globalData.host + "/expense/purpose/" + ID_PARAM + "/delete"

Page({

  /**
   * Page initial data
   */
  data: {
    currencyIndex: 0,
    currencyArray: ["CNY"],
    currencyDisplayArray: ["人民币 CNY"], 
    purposeIds: [1, 17, 7, 8, 11, 13],
    selBeginDate: "2017-01-01",
    selEndDate: "2020-12-31",
    displayAmount: "0.00",
    camera_path: "/images/camera.png",
    arrow_path: "/images/arrow.png",
    note_count: 0,
    note_max: 100,

    editFlag: false,
    disabledEdit: false,
    changeImage: false,

    purpose: {
      code: "12345",
      number: "98765",
      purposeId: 1,
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
        icon_normal: "/images/icons/traffic-unselected.png",
        icon_selected: "/images/icons/traffic-selected.png",
        cn_name: "交通",
        en_name: "Transport"
      },
      {
        icon_normal: "/images/icons/dinner-unselected.png",
        icon_selected: "/images/icons/dinner-selected.png",
        cn_name: "餐饮",
        en_name: "Shift meal"
      },
      {
        icon_normal: "/images/icons/training-unselected.png",
        icon_selected: "/images/icons/training-selected.png",
        cn_name: "培训",
        en_name: "Training"
      },
      {
        icon_normal: "/images/icons/teambuilding-unselected.png",
        icon_selected: "/images/icons/teambuilding-selected.png",
        cn_name: "团建",
        en_name: "Team Build"
      },
      {
        icon_normal: "/images/icons/entertainment-unselected.png",
        icon_selected: "/images/icons/entertainment-selected.png",
        cn_name: "娱乐",
        en_name: "Entertainment"
      },
      {
        icon_normal: "/images/icons/more-unselected.png",
        icon_selected: "/images/icons/more-selected.png",
        cn_name: "其他",
        en_name: "Others"
      }
    ],
    purpose_index: 0,
    sel_pho_btn_title: "Add Invoice",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var _this = this

    var expenseId = options.expenseId
    var expenseDetailId = options.expenseDetailId
    var eFlag = options.disabledEdit
    _this.setData({ editFlag: options.editFlag})

    if(eFlag && eFlag == "true") {
      _this.setData({disabledEdit: true})
    }

    _this.setData({selEndDate: util.formatDate(new Date)})
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
            _this.setData({ displayAmount: util.formatAmountEasy(_this.data.purpose.amount) })
            var iCurrency = util.findIndexInArray(_this.data.currencyArray, _this.data.purpose.currency)
            var iPurpose = util.findIndexInArray(_this.data.purposeIds, _this.data.purpose.purposeId)
            var dLen = 0;
            if (res.data.data.description) {
              dLen = res.data.data.description.length
            }
            _this.setData({
              currencyIndex: iCurrency,
              purpose_index: iPurpose,
              note_count: dLen
            })

            if(res.data.data.status != 0) {
              _this.setData({disabledEdit: true})
            }

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
      _this.setData({ ["purpose.purposeId"]: purposeIds[0]})
      _this.setData({ ["purpose.purposeName"]: _this.data.categorys[0].en_name })
      _this.setData({ ['purpose.amount']: util.formatAmountEasy(_this.data.purpose.amount) })
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
    if (this.data.disabledEdit) return
    var $tmp = e.currentTarget.dataset.id;
    // let query = wx.createSelectorQuery().in(this);
    // query.select('.icon_size');
    // query.exec(function(res){
    //   console.log(res.dataset.id);
    // })
    console.log($tmp);
    this.setData({ ['purpose.purposeId']: $tmp })
    this.setData({ ['purpose.purposeName']: this.data.categorys[$tmp].en_name})
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

  focusAmount: function(e) {
    var _this = this
    console.log("Focus: " + e.detail.value)
    if (e.detail.value == 0 ) {
      _this.setData({ displayAmount: ""})
      console.log("Zero");
    } else {
      _this.setData({ displayAmount: util.removeNumberFormat(e.detail.value) })
    }
  },
  updateAmount: function (e) {
    var _this = this
    var amount = e.detail.value
    if (amount <= 0) {
      wx.showModal({
        title: '金额错误 Amount Error',
        content: "金额应大于 0.00\r\nAmount should be greater than 0.00",
        showCancel: false,
        confirmText: "确定 OK",
        success: function (res) {
          _this.setData({
            ['purpose.amount']: 0,
            displayAmount: util.formatAmountEasy(0)
          })
        }
      })
    } else if (amount > 9999999.99) {
      wx.showModal({
        title: '金额错误 Amount Error',
        content: "金额应小于 9999999.99\r\nAmount should be less than 9999999.99",
        showCancel: false,
        confirmText: "确定 OK",
        success: function (res) {
          _this.setData({
            ['purpose.amount']: 9999999.99,
            displayAmount: util.formatAmountEasy(9999999.99)
          })
        }
      })
    }else {
      _this.setData({
        ['purpose.amount']: e.detail.value,
        displayAmount: util.formatAmountEasy(e.detail.value)
      })
    }
    
  },

  bindDateChange(e) {
    this.setData({
      ['purpose.occurDate']: e.detail.value
    })
  },

  bindDescriptionChange: function (e) {
    var _this = this
    if( e.detail.value.length > _this.data.note_max ) {
      return false
    }
    _this.setData({note_count: e.detail.value.length}) 
    this.setData({
      ['purpose.description']: e.detail.value
    })
  },

  saveAction: function () {
    var _this = this

    if (_this.data.purpose.amount <= 0) {
      wx.showModal({
        title: '金额错误 Amount Error',
        content: "金额应大于 0.00\r\nAmount should be greater than 0.00",
        showCancel: false,
        confirmText: "确定 OK"
      })

      return;
    }

    if (_this.data.purpose.description.trim().length <= 0) {
      wx.showModal({
        title: '备注错误 Description Error',
        content: "备注不能为空！\r\nPlease provide description!",
        showCancel: false,
        confirmText: "确定 OK"
      })

      return;
    }

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

  delAction: function () {
    var _this = this
    if (_this.data.disabledEdit) return
    wx.showModal({
      title: '确认删除 Confirm',
      content: '确定要删除这张票据吗？\r\nAre you sure to delete this item?',
      showCancel: true,
      cancelText: "否 No",
      cancelColor: "#333333",
      confirmText: "是 Yes",
      confirmColor: "#DB0011",
      success: function(e) {
        if(e.cancel) {
          console.log("Click No")
        }
        if (e.confirm) {
          console.log("Click Yes")

          wx.showLoading({
            title: 'Saving...',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 50000)

          var del_url = API_DEL_PURPOSE.replace(ID_PARAM, _this.data.purpose.expenseDetailId)
          api.request({
            url: del_url,
            method: "POST",
            header: {
              WechatAccessToken: null
            },
            success: function (res) {
              wx.navigateBack()
            },
            fail: function (e) {
              wx.showModal({
                title: 'Error',
                content: '删除失败！Delete Failed!',
                showCancel: false,
                confirmText: "确认 OK",
              })
            }
          })
        }
      }
    })
  },

  editAction: function() {
    if (this.data.disabledEdit) return
    this.setData({editFlag: true})
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
          if (_this.data.changeImage && _this.data.purpose.image_path) {
            _this.uploadImage(param);
          }
          // 保存成功后操作
          if (!_this.data.changeImage) {
            // Purpose 保存成功
            wx.hideLoading()
            // wx.showModal({
            //   title: 'Save Success',
            //   content: "Purpose saved successful!",
            //   showCancel: false,
            //   success: param.success,
            //   confirmText: "确定 OK"
            // })
            wx.showToast({
              title: 'Saved',
            })
            param.success()
          }
        } else {
          // 保存失败
          wx.hideLoading()
          wx.showModal({
            title: 'Save Error',
            content: res.data.msg,
            showCancel: false,
            confirmText: "确定 OK"
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
          confirmText: "确定 OK"
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
          // wx.showModal({
          //   title: 'Save Successful',
          //   content: "Purpose with images saved successfull!",
          //   showCancel: false,
          //   success: param.success,
          //   confirmText: "OK"
          // })
          wx.showToast({
            title: 'Saved',
          })
          param.success()
        } else {
          wx.hideLoading()
          wx.showModal({
            title: 'Save Error',
            content: "Purpose have saved, but invoice upload return failed!",
            showCancel: false,
            confirmText: "确定 OK"
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
          confirmText: "确定 OK"
        })
      }
    })
  },
  takeInvoicePhoto() {
    var _this = this
    console.log("click take pricture")
    if (!_this.data.editFlag) {
      console.log("Not in edit status")
      return
    }
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
          sel_pho_btn_title: "Change Invoice",
          changeImage: true
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

          _this.setData({ 
            ["purpose.image_path"]: imagePath,
            sel_pho_btn_title: "Change Invoice" 
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: 'Get Image Error',
            content: res.data.msg,
            showCancel: false,
            confirmText: "确定 OK"
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: 'Get Image Error',
          content: JSON.stringify(res),
          showCancel: false,
          confirmText: "确定 OK"
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