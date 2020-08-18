const app = getApp()
Page({

  data: {
    itemList: [
      {
        name: "国家职业资格证书",
        type: "QUALIFICATIONS",
        data: [
          // {
          //   imageUrl: "/images/ceshi.png",
          //   name: "营业执照营业执照",
          //   state: "已审核",
          // },
          // {
          //   imageUrl: "/images/ceshi.png",
          //   name: "营业执照",
          //   state: "审核中",
          // },
          // {
          //   imageUrl: "/images/ceshi.png",
          //   name: "营业执照",
          //   state: "已驳回",
          // },
        ],
      },
      {
        name: "技能证书",
        type: "SKILL",
        data: [],
      },
      {
        name: "学科竞赛证书",
        type: "COMPETITION",
        data: [],
      },
      {
        name: "四六级成绩",
        type: "CET_4_6",
        data: [],
      },
    ],


  },

  onLoad: function () {
    var that = this
    that.init()

  },

  //初始化
  init: function () {
    var that = this
    wx.showLoading({ title: '加载中...' })

    that.request(
      that.data.itemList[0].type,
      function (res) {
        var tmpData = "itemList[0].data"
        that.setData({ [tmpData]: res })

        that.request(
          that.data.itemList[1].type,
          function (res) {
            var tmpData = "itemList[1].data"
            that.setData({ [tmpData]: res })

            that.request(
              that.data.itemList[2].type,
              function (res) {
                var tmpData = "itemList[2].data"
                that.setData({ [tmpData]: res })

                that.request(
                  that.data.itemList[3].type,
                  function (res) {
                    var tmpData = "itemList[3].data"
                    that.setData({ [tmpData]: res })

                    wx.hideLoading()
                  }
                )
              }
            )
          }
        )
      }
    )



  },

  //简单封装
  request: function (_type, _callback) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/certificate/certificates',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        certificateType: _type
      },
      success: function (res) {
        let data = res.data.data;
        if (data.length == 0) {
          that.setData({
            empty: true
          })
        }
        let certificateList = data;
        certificateList.forEach((item) => {
          if (item.status == "UNREVIEWED") {
            item.status = "审核中";
            item.ok = false;
          } else {
            item.status = "已审核";
            item.ok = true;
          }
        });
        _callback(certificateList)
      },
      fail: function (error) {
        wx.showToast({
          title: res.data.errorMsg,
          icon: "none"
        })
      }
    })
  },

  toAdd: function (k) {
    var tmpType = k.currentTarget.dataset.type

    // QUALIFICATIONS 国家职业资格证书
    // SKILL 技能证书
    // COMPETITION 学科竞赛证书
    // CET_4_6 四六级成绩

    wx.navigateTo({ url: 'add/index?type=' + tmpType })
  },

  toDetail: function (k) {
    var tmpid = k.currentTarget.dataset.id

    wx.navigateTo({ url: 'detail/index?id=' + tmpid })
  },

})