const app = getApp()
const QR = require('../../func/qrcode.js'); //生成二维码用的js文件
const util = require('../../func/base64.js');

Page({
  data: {
    newStep: 0,//新手引导步数
    guidance: [],

    showUserInfo: false,//详细信息
    showQrcode: false,//二维码
    theTimer: 0,//定时器ID
    qrcode: '',//二维码baseCode,

    pushMenu: [false, false, false],

    resume: [-1, -1, -1, -1, -1],//校园章，讲座章，社会实践，志愿时长，义工时长
  },
  //新手引导
  newToNext: function () {
    this.setData({ newStep: this.data.newStep + 1 })
  },

  //定位
  getPos: function () {
    var that = this
    var tmpGuidance = []

    var query = wx.createSelectorQuery()
    query.select('#qrcode').boundingClientRect()
    query.select('#userinfo').boundingClientRect()
    query.select('#detail').boundingClientRect()

    query.exec(
      function (k) {
        tmpGuidance = [
          {
            left: k[0].right + 12,
            top: k[0].top
          },
          {
            right: k[1].left + 12,
            top: k[1].top - 10
          },
          {
            // 水平居中用FLEX布局了~
            // left: k[2].right - (k[3].width / 2.0),
            // left: k[2].right ,
            top: k[2].bottom + 12
          },
        ]

        that.setData({ guidance: tmpGuidance })
      }
    )

  },

  onLoad: function () {
    var that = this
    that.init()

    

    setTimeout(function () { that.getPos() }, 300)
  },


  // 初始化
  init: function () {
    var that = this;
    wx.showLoading({ title: '加载中...', mask: true })

    //获取wxUserInfo
    var tmpuserInfo = app.globalData.userInfo
    //检查用户身份
    that.checkIdentify()


    // 获取活动章...数  -  有点浪费资源~  (套娃是没办法~)    //真机调试会异常卡顿(网络传输问题),部署后正常

    // that.getAnaData('schoolActivity', function (res) {
    //   tmpArray[0] = Number(res)
    //   // Add ...
    // })

    var tmpArray = [0, 0, 0]
    // 校园活动章
    that.getAnaData('schoolActivity', function (res) {
      tmpArray[0] = Number(res)

      // 讲座活动章
      that.getAnaData('lectureActivity', function (res) {
        tmpArray[1] = Number(res)

        // 社会实践
        that.getAnaData('practiceActivity', function (res) {
          tmpArray[2] = Number(res)

          // 志愿时长
          that.getAnaData('volunteerActivity', function (res) {
            tmpArray[3] = Number(res)

            // 义工时长
            that.getAnaData('volunteerWork', function (res) {
              tmpArray[4] = Number(res)

              wx.hideLoading()

              // 字符串拼接~
              var resume0 = "resume[0]"
              var resume1 = "resume[1]"
              var resume2 = "resume[2]"
              var resume3 = "resume[3]"//志愿时长
              var resume4 = "resume[4]"//义工时长

              // 动画
              var i = 0;
              numDH();
              function numDH() {
                if (i < 10) {
                  setTimeout(function () {
                    that.setData({
                      [resume0]: i,
                      [resume1]: i,
                      [resume2]: i,
                      [resume3]: i,
                      [resume4]: i,
                    })
                    i++
                    numDH();
                  }, 50)
                } else {
                  that.setData({
                    [resume0]: tmpArray[0],
                    [resume1]: tmpArray[1],
                    [resume2]: tmpArray[2],
                    [resume3]: tmpArray[3],
                    [resume4]: tmpArray[4],
                  })
                }
              }
              // END动画

            })

          })

        })

      })

    })




    // 一次性初始化
    that.setData({
      userInfo: tmpuserInfo

    })
  },
  // 简单封装 - 数量数据获取
  getAnaData: function (_type, _callback) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/user/activityStamp?activityType=' + _type,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            if (_type == "volunteerWork" || _type == "volunteerActivity") {
              _callback(res.data.data.totalTime)
            } else {
              _callback(res.data.data.activityStamps.length)
            }
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      }
    })
  },

  // 个人详细信息
  showUserInfo: function () {
    this.setData({ showUserInfo: !this.data.showUserInfo })
  },

  //跳转
  toDetail: function (s) {
    var path = s.currentTarget.dataset.type
    wx.navigateTo({ url: '/pages/detail/index?type=' + path })
  },

  // 下拉菜单
  changeMenu: function (o) {
    var that = this
    var id = o.currentTarget.dataset.id//控制的菜单ID
    var tmpPushMenu = that.data.pushMenu
    tmpPushMenu[id] = !tmpPushMenu[id]//可能性能损耗,忽略
    this.setData({ pushMenu: tmpPushMenu })
  },


  // 二维码
  showQrcode: function () {
    var that = this
    clearTimeout(that.data.theTimer)
    that.setData({ showQrcode: !that.data.showQrcode })

    if (that.data.showQrcode == true) {
      that.holdTime()
    }

  },
  holdTime: function () {
    this.showPersonal();
    this.data.theTimer = setTimeout(this.holdTime, 1000 * 10);
  },
  // 二维码生成
  showPersonal: function () {
    var time = (new Date()).getTime();
    if (app.globalData.timeTure == false) {
      time = app.globalData.localSetTime
    }
    var mes = {
      "legal": 'No2Class',
      "stuId": app.globalData.userInfo.stuId,
      "stuName": app.globalData.userInfo.realName,
      "timestamp": time
    };
    var str = JSON.stringify(mes);
    var base64str = util.baseEncode(str);
    var img = QR.createQrCodeImg(base64str, { size: 500 }); //生成二维码

    this.setData({ qrcode: img });
  },


  // 退出登陆
  logOut: function () {
    var that = this;
    wx.showModal({
      content: '确认退出吗',
      success: function (res) {
        if (!res.cancel) {

          wx.request({
            url: app.globalData.apiUrl + '/user/openId',
            method: "DELETE",
            header: {
              'Authorization': wx.getStorageSync('server_token')
            },
            data: {},
            success: function (res) {
              switch (res.data.errorCode) {
                case '200':
                case "401":
                  app.reLaunchLoginPage();
                  break;
                default:
                  app.warning(res.data.errorMsg);
              }
            },
            fail: function () {
              app.warning('服务器错误');
            }
          })
        }
      }
    })
  },

  checkIdentify: function () {
    var showrole = app.globalData.roleInfo;
    //三个bool变量，分别表示记录员和活动创建者的权限，用于决定隐藏按钮
    var display_recorder = false;
    var display_maker = false;
    var not_student = true;

    for (var i = 0; i < showrole.length; i++) {
      switch (showrole[i]) {
        case 'ACTIVITY_STAMPER':
          display_recorder = true;
          break;
        case 'ACTIVITY_MANAGER':
        case 'PARTY_ACTIVITY_MANAGER':
        case 'VOLUNTEER_WORK_MANAGER':
        case 'VOLUNTEER_ACTIVITY_MANAGER':
        case 'PRACTICE_ACTIVITY_MANAGER':
          display_maker = true;
          break;
        case 'NOT_STUDENT':
          not_student = false;
          break;
      }
    }
    //设置视图属性，隐藏相关选项
    this.setData({
      display_recorder: display_recorder,
      display_maker: display_maker,
      not_student: not_student
    });
  },

})
