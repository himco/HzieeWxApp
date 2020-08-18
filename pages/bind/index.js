const app = getApp()
Page({

  data: {
    username: '',
    password: '',

    isLoad: false,
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  // 仅用于接收表单数据
  login: function (res) {
    var that = this
    that.setData(res.detail.value)
  },

  // 获取VX用户信息
  getUserInfo: function (res) {
    var that = this
    if (res.detail.errMsg == "getUserInfo:fail auth deny") {
      app.warning("请允许授权以绑定账号")
    } else {
      // console.log(res.detail.userInfo)
      // 临时测试
      wx.setStorageSync('wxUserInfo', res.detail.userInfo)
      app.getCode(that.reallogin)
    }

  },


  reallogin: function (code) {
    var that = this
    that.setData({ isLoad: !that.data.isLoad })

    wx.setStorageSync('jobInfo', []);
    wx.removeStorageSync('job');

    //登录
    wx.request({
      url: app.globalData.apiUrl + '/user/openId',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.username,
        password: that.data.password,
        code: code,
        avatarUrl: wx.getStorageSync('wxUserInfo').avatarUrl, //上传头像地址
      },
      success: function (res) {
        that.setData({ isLoad: !that.data.isLoad })
        switch (res.data.errorCode) {
          case "200":
            console.log(res);

            wx.setStorageSync('server_token', res.data.data.token);
            wx.setStorageSync('jobInfo', res.data.data.jobInfo);
            var token = wx.getStorageSync('server_token');

            app.globalData.userInfo = res.data.data.userInfo
            app.globalData.userInfo.avatarUrl = wx.getStorageSync('wxUserInfo').avatarUrl//获取头像地址

            // app.globalData.stuId = res.data.data.userInfo.stuId;//学号190970412
            // app.globalData.realName = res.data.data.userInfo.realName;//姓名薛之谦
            // app.globalData.major = res.data.data.userInfo.major;//专业计算机类
            // app.globalData.classId = res.data.data.userInfo.classId;//班级190907104
            // app.globalData.grade = res.data.data.userInfo.grade;//年级2020

            app.globalData.roleInfo = res.data.data.roleInfo;

            wx.redirectTo({ url: '../index/index' })
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        that.setData({ isLoad: !that.data.isLoad })
        app.warning('服务器错误，请稍后重试');
      }
    })
  }

})