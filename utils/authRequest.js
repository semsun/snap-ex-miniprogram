const SESSION_ID = "authorization"

var auth = {
  request: function (paramObj) {
    // 获取授权码
    auth.getAuthCode({
      success: function (authCode) {
        // 添加授权码到 HEAD
        paramObj.header.authorization = authCode

        wx.request(paramObj)
      },
      fail: paramObj.fail
    })
  },
  getAuthCode: function(paramObj) {
    wx.getStorageInfo({
      key: SESSION_ID,
      success: function(res) {
        // 成功在本地存储中找到 Session Key
        typeof paramObj.success == "function" && paramObj.success(res)
      },
      fail: function(res) {
        // 本地存储中没有 Session Key, 重新登陆
        auth.login({
          success: function(res) {
            // 重新登陆成功
            wx.setStorage({
              key: SESSION_ID,
              data: res
            })
            typeof paramObj.success == "function" && paramObj.success(res)
          },
          fail: paramObj.fail
        })
      }
    })
  },
  login: function (paramObj) {
    console.log("Login")
    wx.login({
      success: function (res) {
        console.log("Login Code:" + res.code);
        wx.request({
          url: 'http://39.108.227.233:9000/user/register',
          method: 'POST',
          data: {
            "code": res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            typeof paramObj.success == "function" && paramObj.success(res)
          },
          fail: paramObj.fail
        })
      },
      fail: paramObj.fail
    })
  },
  test1: function(paramObj) {
    console.log("Test1 call Test2")
    paramObj.func = function (res) {
        console.log(res)
    }

    auth.test2(paramObj)
  },
  test2: function (paramObj) {
    console.log("Test2")

    typeof paramObj.func == "function" && paramObj.func("value:" + paramObj.value)
  }
}

module.exports = {
  test1: auth.test1
}