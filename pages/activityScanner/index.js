const util = require("../../utils/newutil.js")
const app = getApp()

Page({
  data: {
    empty: true,
    listData: []
  },

  onLoad: function (options) {
    this.showTasks();
  },

  showTasks: function () {
    var that = this;
    wx.request({
      //查看扫码员的扫码任务
      url: app.globalData.apiUrl + '/activityStamp/mission',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            if (res.data.data.length > 0) { that.data.empty = false }
            var temp = res.data.data;
            for (var i = 0; i < temp.length; i++) {
              switch (temp[i].type) {
                case 'schoolActivity': temp[i].type = '校园活动'; break;
                case 'practiceActivity': temp[i].type = '社会实践'; break;
                case 'volunteerActivity': temp[i].type = '志愿活动'; break;
                case 'volunteerWork': temp[i].type = '义工活动'; break;
                case 'lectureActivity': temp[i].type = '讲座活动'; break;
                case 'partyActivity': temp[i].type = '党建活动'; break;
                case 'partyTimeActivity': temp[i].type = '交换一小时'; break;
              }
              if (temp[i].description == null) {
                temp[i].description = '';
              }

              //转换学期
              var tmpTerm = temp[i].term
              temp[i].term = tmpTerm.substring(0, 4) + '-' + (Number(tmpTerm.substring(0, 4)) + 1) + (tmpTerm.substring(4, 5) == 'A' ? '第一学期' : '第二学期')

              //转换时间
              temp[i].start = util.timeStamp2Time((temp[i].start) / 1000, 'Y年M月D日 h:m')
              temp[i].end = util.timeStamp2Time((temp[i].end) / 1000, 'Y年M月D日 h:m')
            }
            that.setData({
              listData: temp,
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
      fail: function (res) {
        app.warning('服务器错误');
      }
    });

  },

  toScan: function (e) {

    var data = e.currentTarget.dataset;
    var acName = data.name;
    var acId = data.id;
    var acType = '';
    switch (data.type) {
      case '校园活动': acType = 'schoolActivity'; break;
      case '社会实践': acType = 'practiceActivity'; break;
      case '志愿活动': acType = 'volunteerActivity'; break;
      case '义工活动': acType = 'volunteerWork'; break;
      case '讲座活动': acType = 'lectureActivity'; break;
      case '党建活动': acType = 'partyActivity'; break;
      case '交换一小时': acType = 'partyTimeActivity'; break;
    }
    wx.navigateTo({
      url: 'scan/index?acName=' + acName + '&acId=' + acId + '&acType=' + acType,
    })
  }

})