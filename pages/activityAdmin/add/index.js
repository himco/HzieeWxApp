const app = getApp();
const util = require('../../../utils/newutil.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    picker: ['校园活动', '志愿活动', '实践活动','讲座活动'],
    pickers: ['2017-2018 第一学期', '2017-2018 第二学期', '2018-2019 第一学期','2018-2019 第二学期','2019-2020 第一学期','2019-2020 第二学期'],
    date: '2000-01-15',
    textareaAValue: '',

    activityName: '',
    activityType: '',
    activityStartTime: '',
    activityEndTime: '',
    activitystartDay: '2000-11-11',
    activityendDay: '2000-11-11',
    organizationMessage: '',
    description: '',
    term: ''
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  PickersChange(e) {
    console.log(e);
    this.setData({
      indexs: e.detail.value
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  onLoad: function(options) {
    var that = this;
    // var roleInfo = app.globalData.roleInfo;
    var roleInfo = ['ACTIVITY_MANAGER','VOLUNTEER_ACTIVITY_MANAGER','PRACTICE_ACTIVITY_MANAGER']
    
    var typeList=[];
    // var typeArray = listArray.getActivityType();
    var typeArray = []

    var type;
    for (var i = 0; i < roleInfo.length; i++) {
      switch (roleInfo[i]) {
        case 'ACTIVITY_MANAGER':
          typeList=typeArray;
          type ='manage';
          break;
        case 'VOLUNTEER_ACTIVITY_MANAGER':
          typeList.push(typeArray[1]);
          type = 'volunteerActivity';
          break;
        case 'PRACTICE_ACTIVITY_MANAGER':
          typeList.push(typeArray[2]);
          type = 'practice';
          break;
      }
    }
    var now = new Date();
    // 初始化活动时间及日期
    console.log(util.getHM(now))
    that.setData({
      'activityStartTime': util.getHM(now),
      'activityEndTime': util.getHM(now),
      'activitystartDay': util.getYMD(now),
      'activityendDay': util.getYMD(now),
      typeList: typeList,
      type:type
    });

  },
  // 设置活动开始时间
  setStartTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'activityStartTime': e.detail.value
    });
  },
  // 设置活动结束时间
  setEndTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'activityEndTime': e.detail.value
    });
  },

  // 设置开始日期
  startDateChange: function (e) {
    this.setData({
      activitystartDay: e.detail.value
    })
  },

  // 设置结束日期
  endDateChange: function (e) {
    this.setData({
      activityendDay: e.detail.value
    })
  },
})