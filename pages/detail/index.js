var app = getApp();

Page({

  data: {
    pageInfo: {
      title: '加载中...',
      detail: '加载中...',
      more: false,
    },

    listData: [],
    empty: true
  },

  onLoad: function (options) {
    var that = this
    var tmpPageInfo = {}

    switch (options.type) {
      case 'schoolActivity': {
        tmpPageInfo.title = "校园活动章"
        tmpPageInfo.detail = "校园"
        break
      }
      case 'lectureActivity': {
        tmpPageInfo.title = "讲座活动章"
        tmpPageInfo.detail = "讲座"
        break
      }
      case 'practiceActivity': {
        tmpPageInfo.title = "社会实践次数"
        tmpPageInfo.detail = "社会实践"
        break
      }
      case 'partyActivity': {
        tmpPageInfo.title = "\"新学习\"系列活动"
        tmpPageInfo.detail = "\"新学习\"系列活动"
        break
      }
      case 'partyTimeActivity': {
        tmpPageInfo.title = "交换一小时"
        tmpPageInfo.detail = "交换一小时"
        tmpPageInfo.more = true
        break
      }
      case 'volunteerActivity': {
        tmpPageInfo.title = "志愿时长"
        tmpPageInfo.detail = "志愿"
        tmpPageInfo.more = true
        break
      }
      case 'volunteerWork': {
        tmpPageInfo.title = "义工时长"
        tmpPageInfo.detail = "义工"
        tmpPageInfo.more = true
        break
      }
      default: {
        wx.showToast({ title: '请求异常，请重试', icon: "none" })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    }

    if (options.type == '' || options.type == null) {
    } else {
      that.setData({ pageInfo: tmpPageInfo })
      that.showSeals(options.type);
    }
  },

  showSeals: function (_type) {
    var that = this;
    wx.showLoading({ title: '加载中...' })

    wx.request({
      url: app.globalData.apiUrl + '/user/activityStamp?activityType=' + _type,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        wx.hideLoading()

        switch (res.data.errorCode) {
          case "200":
            var timestr, newTimeStr;
            for (var i = 0; i < res.data.data.activityStamps.length; i++) {
              //将数据库时间字符串转为视图时间字符串
              timestr = res.data.data.activityStamps[i].createTime;
              newTimeStr = app.getDateStrByTimeStr(timestr);
              res.data.data.activityStamps[i].createTime = newTimeStr;

              //转换学期
              var tmpTerm = res.data.data.activityStamps[i].term
              res.data.data.activityStamps[i].term = tmpTerm.substring(0, 4) + '-' + (Number(tmpTerm.substring(0, 4)) + 1) + (tmpTerm.substring(4, 5) == 'A' ? '第一学期' : '第二学期')
            }

            if (res.data.data.activityStamps.length > 0) {
              that.data.empty = false;
            }
            //更新视图
            that.setData({
              listData: res.data.data.activityStamps,
              totalTime: res.data.data.totalTime,
              empty: that.data.empty
            });
            break;
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

})