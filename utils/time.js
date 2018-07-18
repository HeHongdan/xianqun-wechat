/**
 * 时间工具
 * 
 * hehongdan
 * 20180717
 */

//向外暴露模块
module.exports = {
    getYesterdayFormat: getYesterdayFormat,
}

/**
 * 获取前天并格式化（2018010100）
 */
function getYesterdayFormat() {
    //昨天的时间 
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateTime(yesterday);
}

var formatDateTime = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + m + d + "00";
    //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};



//https://www.cnblogs.com/sxxjyj/p/6093326.html
// //昨天的时间 
// var day1 = new Date();
// day1.setDate(day1.getDate() - 1);
// var s1 = day1.format("yyyy-MM-dd");
// //前天的时间
// var day2 = new Date();
// day2.setDate(day2.getDate() - 2);
// var s2 = day2.format("yyyy-MM-dd");
// //var s2 = day2.format("yyyy-MM-dd");

// //昨天的时间
// var day1 = new Date();
// day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
// var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
// //今天的时间
// var day2 = new Date();
// day2.setTime(day2.getTime());
// var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();

// //明天的时间
// var day3 = new Date();
// day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
// var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();

// //拼接时间
// function show() {
//     var str = "" + s1 + "至" + s2;
//     return str;
// }
// //赋值doubleDate
// $('#dateS').val(show());