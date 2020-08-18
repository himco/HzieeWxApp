//函数列表
//onLunch 小程序初始化监听函数
//getCode 获取code并执行callback
//warning 弹窗提示（为了缩减代码，用一个函数调用代替wx.showModal）
//getDateStrByTimeStr 将后台传入的数据库字符串转换为“-年-月-日-时-分”的字符串
App({
  globalData: {
    roleInfo: null,
    timeTure: true,
    localSetTime: null,
    power: null,
    code: null,
    // stuId: null,
    // realName: null,
    // major: null,
    // classId: null,
    // grade: null,

    userInfo: {
      // classId: "190907104",
      // enrollDate: 1567236347000,
      // extInfo: {},
      // grade: "2020",
      // major: "测试专业",
      // realName: "薛之谦",
      // sex: "男",
      // stuId: "123456789",
      // userId: "201908311525464037560001201924",
      // userInfoId: "201908311525463486938300073124",
    },


    apiUrl: 'https://hupanyouth.cn',
    // apiUrl: 'http://120.79.91.97:8666',
    // apiUrl: 'http://47.100.214.92:7009',
    apiUrl: 'http://121.36.28.205:7100/',
  },

  onLaunch: function () {

    // 获取自定义导航条高度
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })


    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }

    /**
     * 作为图传次数保护
     */
    let now = new Date();
    now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    wx.setStorageSync('date', now);
    wx.setStorageSync('timeMap', {});
  },

  getCode: function (callback) {
    wx.login({
      success: function (res) {
        callback(res.code);
      }
    })
  },

  warning: function (content) {
    wx.showModal({
      content: '' + content,
      showCancel: false
    });
  },

  reLaunchLoginPage: function () {
    //token不正确时，清除本地token并跳转至登录界面
    wx.removeStorageSync('server_token');
    wx.reLaunch({
      url: '/pages/prelogin/index',
    })
  },

  getDateStrByTimeStr: function (time) {
    var dateTime = new Date(time);
    var dateStr = '';
    dateStr += dateTime.getFullYear() + '年';
    dateStr += (dateTime.getMonth() + 1) + '月';
    dateStr += dateTime.getDate() + '日';
    dateStr += dateTime.getHours() + '时';
    dateStr += dateTime.getMinutes() + '分';
    return dateStr;
  },


})