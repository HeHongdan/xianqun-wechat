/** 
 * 每天天气
 * 
 * 何洪丹
 * 20180710
 */

//将模块接口暴露出来
//转化成小程序模板语言
module.exports = {
  createHour: create,
  addHour: add,
};

export default Behavior({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
  },
});

/**
 * 工厂模式创建对象 * 小时的天气
 * date 日期
 * tempDay 温度(高)
 * tempNight 温度(低)
 * weather1 天气情况1
 * weather2 天气情况1
 * wind1 风向1
 * wind2 风向1
 * windForce 风力
 * 
 * 返回一天的天气对象
*/
function create(date, tempDay, tempNight, weather1, weather2, wind1, wind2, windForce) {
  var weatherHour = new Object();
  weatherHour.date = date;
  weatherHour.tempDay = tempDay;
  weatherHour.tempNight = tempNight;
  weatherHour.weather1 = weather1;
  weatherHour.weather2 = weather2;
  weatherHour.wind1 = wind1;
  weatherHour.wind2 = wind2;
  weatherHour.windForce = windForce;

  // o.sayName = function() {
  //   alert(this.name);
  // }
  return weatherHour;　　
};

/** 
 * 向服务器新增一行记录（Bmob）
 * 
 * 服务器工具
 * 小时的天气对象
 */
function add(query, weatherHour){
  //const query = Bmob.Query('weatherHour');
  query.set("date", weatherHour.date)
  query.set("tempDay", weatherHour.tempDay)
  query.set("tempNight", weatherHour.tempNight)
  query.set("weather1", weatherHour.weather1)
  query.set("weather2", weatherHour.weather2)
  query.set("wind1", weatherHour.wind1)
  query.set("wind2", weatherHour.wind2)
  query.set("windForce", weatherHour.windForce)
  query.save().then(res => {
    //console.log('一小时天气新增成功=')
    //console.log(res)
  }).catch(err => {
    //console.log('一小时天气新增失败=')
    //console.log(err)
  });
};