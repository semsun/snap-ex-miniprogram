const app = getApp()

const STATUS_EXPIRE = "401"
const SESSION_ID = "WechatAccessToken"
const RETRY_TIMES = 3
const REG_URL = app.globalData.host + "/user/register"

var auth = {
  retry: 0,
  request: function (paramObj) {
    // wx.removeStorageSync(SESSION_ID)
    // 获取授权码
    auth.getAuthCode({
      success: function (authCode) {
        // 添加授权码到 HEAD
        paramObj.header.WechatAccessToken = authCode
        var tmpFunc = paramObj.success
        paramObj.success = function(res) {
          console.log(res)
          if (res.data.code && res.data.code == STATUS_EXPIRE) {
            // Token 失效处理
            wx.removeStorage({
              key: SESSION_ID,
              success: function(res) {
                auth.retry = auth.retry + 1;
                console.log("Retry times: " + auth.retry)
                if (auth.retry >= RETRY_TIMES ) {
                  auth.retry = 0
                  // 限制自动重试次数
                  console.log("Full retry, return ERROR")
                  typeof paramObj.fail == "function" && paramObj.fail(res)
                } else {
                  // 清除缓存，递归调用请求
                  auth.request(paramObj)
                  return
                }
              },
            })
          } else {
            // 返回成功信息
            console.log("Return to business page")
            typeof tmpFunc == "function" && tmpFunc(res)
          }
        }

        wx.request(paramObj)
      },
      fail: paramObj.fail
    })
  },
  uploadFile: function (paramObj) {
    // wx.removeStorageSync(SESSION_ID)
    // 获取授权码
    auth.getAuthCode({
      success: function (authCode) {
        // 添加授权码到 HEAD
        paramObj.header.WechatAccessToken = authCode
        paramObj.header.accept = "application/json;charset=UTF-8"
        var tmpFunc = paramObj.success
        paramObj.success = function (res) {
          console.log("[UploadFile] " + res)
          if (res.data.code && res.data.code == STATUS_EXPIRE) {
            // Token 失效处理
            wx.removeStorage({
              key: SESSION_ID,
              success: function (res) {
                auth.retry = auth.retry + 1;
                console.log("[UploadFile] Retry times: " + auth.retry)
                if (auth.retry >= RETRY_TIMES) {
                  auth.retry = 0
                  // 限制自动重试次数
                  console.log("[UploadFile] Full retry, return ERROR")
                  typeof paramObj.fail == "function" && paramObj.fail(res)
                } else {
                  // 清除缓存，递归调用请求
                  auth.uploadFile(paramObj)
                  return
                }
              },
            })
          } else {
            // 返回成功信息
            console.log("[UploadFile] Return to business page")
            typeof tmpFunc == "function" && tmpFunc(res)
          }
        }

        wx.uploadFile(paramObj)
      },
      fail: paramObj.fail
    })
  },
  getAuthCode: function(paramObj) {
    wx.getStorage({
      key: SESSION_ID,
      success: function(res) {
        // 成功在本地存储中找到 Session Key
        typeof paramObj.success == "function" && paramObj.success(res.data)
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
          url: REG_URL,
          method: 'POST',
          data: {
            "code": res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            typeof paramObj.success == "function" && paramObj.success(res.data.WechatAccessToken)
          },
          fail: paramObj.fail
        })
      },
      fail: paramObj.fail
    })
  },
  logout: function(paramObj) {
    wx.removeStorage({
      key: SESSION_ID,
      success: function(res) {
        wx.redirectTo({
          url: '/pages/Login/Login',
        })
      },
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
  SESSION_ID: SESSION_ID,
  REG_URL: REG_URL,
  test1: auth.test1,
  getAuthCode: auth.getAuthCode,
  request: auth.request,
  uploadFile: auth.uploadFile,
  logout: auth.logout
}