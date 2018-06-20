//app.js

//导入
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

//微信用户授权信息
let userInfo

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  },

  login({
    success,
    error
  }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false,
            success: () => {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo'] === true) {
                    this.doQcloudLogin({
                      success,
                      error
                    })
                  }
                }
              })
            }
          })
        } else {
          this.doQcloudLogin({
            success,
            error
          })
        }
      }
    })
  },

  doQcloudLogin({
    success,
    error
  }) {
    // 调用 qcloud 登陆接口
    success: result => {
      if (result) {
        userInfo = result

        success && success({
          userInfo
        })
      } else {
        // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
        this.getUserInfo
      }
    }
  },

  //获取微信用户信息
  getUserInfo({
    success,
    error
  }) {
    if (userInfo) return userInfo

    qcloud.request({
      url: config.service.user,
      login: true,
      success: result => {
        let data = result.data

        if (!data.code) {
          userInfo = data.data

          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: () => {
        error && error()
      }
    })
  },

  /**检查登陆状态*/
  checkSession({
    success,
    error
  }) {
    if (userInfo) {
      return success && success({
        userInfo
      })
    }
    wx.checkSession({
      success: () => {
        this.getUserInfo({
          success: () => {
            this.getUserInfo({
              success: res => {
                userInfo = res.userInfo
                success && success({
                  userInfo
                })
              },
              fail: () => {
                error && error()
              }
            })
          },
          fail: () => {
            error && error()
          }
        })
      },
      fail: () => {
        error && error()
      },
    })
  },

})