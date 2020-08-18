// pages/user/cgPwd/index.js
var app = getApp();

Page({

  data: {},

  onLoad: function () {

  },

  // 获得表单数据并校验
  submit: function ({ detail }) {
    var that = this;

    if (
      detail.value.pwd1 == null || detail.value.pwd1 || detail.value.pwd1 == null ||
      detail.value.pwd1 == '' || detail.value.pwd1 == '' || detail.value.pwd1 == ''
    ) {
      app.warning('请检测是否填写完整')
    } else if (detail.value.pwd2 == detail.value.pwd3) {
      wx.login({
        success: function (res) {
          that.requestChangePwd(res.code, detail.value.pwd1, detail.value.pwd2);
        }
      })
    } else {
      app.warning('两次密码不一致')
    }
  },

  requestChangePwd: function (code, oldPwd, newPwd) {
    wx.request({
      url: app.globalData.apiUrl + '/user/pwd',
      method: "PUT",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        password: oldPwd,
        newPassword: newPwd
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            wx.removeStorageSync('server_token');
            wx.reLaunch({ url: '/pages/bind/index' }); break;
          case "401":
            //token不正确时，清除本地token并跳转至登录界面
            wx.removeStorageSync('server_token');
            wx.redirectTo({
              url: '/pages/prelogin/index'
            });
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      }
    })
  }
})