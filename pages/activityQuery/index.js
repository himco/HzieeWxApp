var app = getApp();

Page({

  data: {
    typeTabList: [
      {
        'id': '0',
        'title': '不限'
      },
      {
        'id': '1',
        'title': '校园活动'
      },
      {
        'id': '2',
        'title': '社会实践'
      },
      {
        'id': '3',
        'title': '志愿活动'
      },
      {
        'id': '4',
        'title': '义工活动'
      },
      {
        'id': '5',
        'title': '讲座活动'
      }
    ],
    typeState: [
      {
        'id': '0',
        'title': '进行中'
      },
      {
        'id': '1',
        'title': '已报名'
      },
      {
        'id': '2',
        'title': '已过期'
      }
    ],
    type_id: 0,//默认值
    typeIndex: 0,
    term_id: 0,
    termIndex: 0,

    tab: [true, true],
    currentTab: null,

    listData: [],
    empty: true
  },

  onLoad: function (options) {
    var that = this

    that.showSeals()

  },

  /**
 * 头部筛选栏触发的函数
 */
  tabNav(e) {
    var data = [true, true],
      index = e.target.dataset.currentind;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
    if (this.data.currentTab != index) {
      this.setData({
        currentTab: index
      })
    } else {
      this.setData({
        currentTab: null
      })
    }
  },

  /**
 * 筛选项点击操作
 */
  filter: function (e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index;

    // 改变显示状态
    switch (index) {
      case '0':
        that.setData({
          tab: [true, true],
          type_id: id,
          typeIndex: id
        });
        break;
      case '1':
        that.setData({
          tab: [true, true],
          term_id: id,
          termIndex: id
        });
        break;
    }
    if (index == 0) {
      that.data.activityType = that.typeChange(id);
      console.log(that.data.activityType);
      if (that.data.activityStatus == "REGISTERED") {
        this.showState();
      } else {
        this.showSeals();
      }

    } else {
      that.data.activityStatus = that.stateChange(id);
      that.setData({
        stateId: id
      })
      console.log(that.data.activityStatus);
      this.showState();
    }
    that.setData({
      page: 0
    })


  },


  showSeals: function (_type) {
    var that = this;
    wx.showLoading({ title: '加载中...' })

    wx.request({
      url: app.globalData.apiUrl + '/user/activityStamp?activityType=schoolActivity',
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