const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekWeather:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getWeekWeather()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh(){
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 请求网络数据
   */
  getWeekWeather(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data:{
        time:new Date().getTime(),
        city:'广州市',
      },

      success: res => {
        let result = res.data.result
        this.setWeekWeather(result)
      },

      complete: () => {
        callback && callback()
      },

    })
  },

  /**
   * 设置内容
   */
  setWeekWeather(result) {
    let weekWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate()+i)
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
        iconPath: '/images/' + result[i].weather + '-icon.png',
      })
    }

    weekWeather[0].day = `今天`
    this.setData({
      weekWeather
    })

  },
})