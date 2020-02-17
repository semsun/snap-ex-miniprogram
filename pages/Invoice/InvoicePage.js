// pages/Invoice/InvoicePage.js
Page({

  /**
   * Page initial data
   */
  data: {
    invoice: {
      code: "12345",
      number: "98765",
      category: 0, /* 0: Team Build; 1: Taffic; 2: Room; 3: Food; 4:Training; 5: Travel */
      companyName: "Test Company",
      date: "20191017",
      currency: "CNY",
      amount: 100.12,
      description: "Catering service"
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
    purpose_index: 0
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
    // var myThis = this
    // this.data.storageData = wx.getStorageSync("tmpData");
    // wx.getStorage({
    //   key: 'tmpData',
    //   success: (res) =>{
    //     console.log("getStorage: " + res.data)
    //     this.setData({
    //       storageData: res.data
    //     })
    //   },
    // })
    var tmp = JSON.parse(options.json)
    // if( !tmp.code && typeof(tmp.code) != typeof(undefined) && length(trim(tmp.code)) > 0 ) {
    this.setData({ ['invoice.code']: tmp.code })
    this.setData({ ['invoice.number']: tmp.number })
    this.setData({ ['invoice.date']: tmp.date })
    this.setData({ ['invoice.amount']: tmp.amount })
    this.setData({ ['invoice.category']: tmp.category })

      console.log("New:" + tmp.code)
    // }

    console.log("Receive:" + this.data.invoice.code)
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
  changeCategory: function(e) {
    var $tmp = e.currentTarget.dataset.id;
    // let query = wx.createSelectorQuery().in(this);
    // query.select('.icon_size');
    // query.exec(function(res){
    //   console.log(res.dataset.id);
    // })
    console.log($tmp);
    this.setData({ ['invoice.category']: $tmp })
  },

  addInvoice: function (e) {
    wx.scanCode({
      success: (res) => {
        var strArr = res.result.split(',');
        console.log(strArr);
        this.setData({
          invoice: {
            code: strArr[2],
            number: strArr[3],
            date: strArr[5],
            amount: parseFloat(strArr[4])
          }
        })

        var param = JSON.stringify(this.data.invoice);
        console.log(param);
        wx.redirectTo({
          url: '/pages/Invoice/InvoicePage?json=' + param,
        })
      }
    })
  },

  saveInvoice: function() {
    wx.showLoading({
      title: 'Saving...',
    })
    setTimeout(function(){
      wx.hideLoading()
    }, 10000)

    wx.hideLoading()

    wx.redirectTo({
      url: '/pages/incex/index',
    })

    // var item = { 
    //   purpose: this.data.purpose_array[this.data.purpose_index].purpose, 
    //   date: this.data.invoice.date, 
    //   currency: this.data.invoice.currency, 
    //   amount: this.data.invoice.amount }

    //   wx.getStorage({
    //     key: 'purposes',
    //     success: function(res) {
    //       res.data.push(item);

    //       wx.setStorage({
    //         key: 'purposes',
    //         data: res.data,
    //         success:function(res) {
    //           wx.showToast({
    //             icon: 'cancel',
    //             title: 'Save Successful',
    //           })
    //           setTimeout(function(){
    //             wx.navigateTo({
    //               url: '/pages/claimForm/claimForm',
    //             })
    //           }, 800)
    //         },
    //         fail: function (res) {
    //           wx.hideLoading()
    //           wx.showModal({
    //             title: 'Save Failed!',
    //             content: res.errMsg,
    //             showCancel: false
    //           })
    //         }
    //       })
    //     },
    //     fail: function (res) {
    //       wx.hideLoading()
    //       wx.showModal({
    //         title: 'Save Failed!',
    //         content: res.errMsg,
    //         showCancel: false
    //       })
    //     }
    //   })
  }
})