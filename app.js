//app.js

//导入
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
//获取Bmob实例
var Bmob = require('./libs/bmob/Bmob-1.6.1.min.js')
Bmob.initialize(
  '2fb6fe153e51032b3f59a55291efe93e',
  'a1b824a36e36337ffcf567bbad22ea43'
)

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

/**
 * 一天的天气
 * date 日期
 * tempDay 温度(高)
 * tempNight 温度(低)
 * weather1 天气情况1
 * weather2 天气情况1
 * wind1 风向1
 * wind2 风向1
 * windForce 风力
*/
  WeatherDay(date, tempDay, tempNight, weather1, weather2, wind1, wind2, windForce) {
    this.date = date;
    this.tempDay = tempDay;
    this.tempNight = tempNight;
    this.weather1 = weather1;
    this.weather2 = weather2;
    this.wind1 = wind1;
    this.wind2 = wind2;
    this.windForce = windForce;
  },

  /**
   * 一小时的天气
   * time 时间（小时）
   * temp 温度
   * weather 天气
   * wind 风向
   * windForce 风力1
  */
  WeatherHour(time, temp, weather, wind, windForce) {
    this.time = time;
    this.temp = temp;
    this.weather = weather;
    this.wind = wind;
    this.windForce = windForce;
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