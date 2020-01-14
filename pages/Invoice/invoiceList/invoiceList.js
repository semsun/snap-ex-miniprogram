// pages/Invoice/invoiceList/invoiceList.js
Page({
  options: {
    addGlobalClass: true
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    focus: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: 'Search'
    },
    value: {
      type: String,
      value: ''
    },
    search: {
      type: Function,
      value: null
    },
    throttle: {
      type: Number,
      value: 500
    },
    cancelText: {
      type: String,
      value: 'Cancel'
    },
    cancel: {
      type: Boolean,
      value: true
    }
  },

  /**
   * Page initial data
   */
  data: {
    list: [
      {
        icon: "/images/icons/teambuild_normal.png",
        title: "test",
        src: ""
      },
      {
        icon: "/images/icons/teambuild_normal.png",
        title: "test",
        src: ""
      },
      {
        icon: "/images/icons/teambuild_normal.png",
        title: "test",
        src: ""
      }
    ],
    result: []
  },
  lastSearch: Date.now(),
  lifetimes: {
    attached: function attached() {
      if (this.data.focus) {
        this.setData({
          searchState: true
        });
      }
    }
  },
    clearInput: function clearInput() {
      this.setData({
        value: ''
      });
      this.triggerEvent('clear');
    },
    inputFocus: function inputFocus(e) {
      this.triggerEvent('focus', e.detail);
    },
    inputBlur: function inputBlur(e) {
      this.setData({
        focus: false
      });
      this.triggerEvent('blur', e.detail);
    },
    showInput: function showInput() {
      this.setData({
        focus: true,
        searchState: true
      });
    },
    hideInput: function hideInput() {
      this.setData({
        searchState: false
      });
    },
    inputChange: function inputChange(e) {
      var _this = this;

      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('input', e.detail);
      if (Date.now() - this.lastSearch < this.data.throttle) {
        return;
      }
      if (typeof this.data.search !== 'function') {
        return;
      }
      this.lastSearch = Date.now();
      this.timerId = setTimeout(function () {
        _this.data.search(e.detail.value).then(function (json) {
          _this.setData({
            result: json
          });
        }).catch(function (err) {
          console.log('search error', err);
        });
      }, this.data.throttle);
    },
    selectResult: function selectResult(e) {
      var index = e.currentTarget.dataset.index;

      var item = this.data.result[index];
      this.triggerEvent('selectresult', { index: index, item: item });
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