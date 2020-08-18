const app = getApp()
Page({

  data: {},

  onLoad: function (options) {
    var that = this
    app.getCode(that.prelogin)
  },

  checkTime: function () {
    console.log(app.globalData.localSetTime)
    app.globalData.localSetTime += 1000
    setTimeout(this.checkTime, 1000);
  },

  prelogin: function (code) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/user',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },


      success: function (res) {
        var severDate = new Date(res.header.Date)
        var severTime = severDate.getTime()

        var localDate = new Date()
        var localTime = localDate.getTime();
        if (Math.abs(localDate - severTime) >= 15000) {
          app.globalData.timeTure = false
          console.log(app.globalData.timeTure)
          app.globalData.localSetTime = severTime
          that.checkTime()
        } else {
          app.globalData.timeTure = true
        }

        switch (res.data.errorCode) {
          case "401":
            //token不正确时，清除本地token并跳转至登录界面
            wx.removeStorageSync('server_token');
            wx.redirectTo({ url: '../bind/index' }); break;
          case "200":
            app.globalData.userInfo = res.data.data.userInfo

            // app.globalData.stuId = res.data.data.userInfo.stuId;//学号190970412
            // app.globalData.realName = res.data.data.userInfo.realName;//姓名薛之谦
            // app.globalData.major = res.data.data.userInfo.major;//专业计算机类
            // app.globalData.classId = res.data.data.userInfo.classId;//班级190907104
            // app.globalData.grade = res.data.data.userInfo.grade;//年级2020

            app.globalData.roleInfo = res.data.data.roleInfo;
            wx.redirectTo({ url: '../index/index' })
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },


      fail: function () { app.warning('服务器错误'); }


    })
  }

})