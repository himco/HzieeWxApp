var app = getApp();
var util = require("../../../utils/newutil.js")
Page({

  data: {

  },

  onLoad: function (options) {
    //  options.id
    var that = this;
    var certificateId = options.id;
    // var id = options.passId;
    // if (id != "") {
    //   that.setData({
    //     passId: id,
    //     passBtn: true
    //   })
    // }
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        certificateId: certificateId,
      },
      success: function (res) {
        console.log(res);
        switch (res.data.errorCode) {
          case '200':
            if (res.data.data.type == "Teacher") {
              that.setData({
                teacher: true,
                certificateType: '教师资格证',
                teacherLevel: res.data.data.extInfo.teacherLevel,
                teacherSubject: res.data.data.extInfo.teacherSubject,

              })
            } else if (res.data.data.type == "International") {
              that.setData({
                teacher: false,
                certificateType: 'ACCA/CFA',
              })
            } else {
              that.setData({
                teacher: false,
                certificateType: '常规证书',

              })
            }
            let date = util.getYM(new Date(res.data.data.certificatePublishTime))
            that.setData({
              certificateId: res.data.data.certificateId,
              certificateName: res.data.data.certificateName,
              certificateNumber: res.data.data.certificateNumber,
              certificateOrganization: res.data.data.certificateOrganization,
              description: res.data.data.extInfo.description,
              rank: res.data.data.rank,
              certificateTime: date,
              description: res.data.data.extInfo.description,
              pictureUrl: res.data.data.pictureUrl
            })
            break;
          default:
            wx.redirectTo({
              url: '../index/index'
            })
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 3000
            })
            break;
        }



      },
      fail: function (error) {
        wx.redirectTo({
          url: '../index/index'
        })
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },


  onShareAppMessage: function () {

  }
})