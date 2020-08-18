var app = getApp();

Page({

  data: {
    stepList: {
      current: 2,
      names: ['基本信息', '证书上传', '证书信息', '补充信息']
    },

    date: '2020-08',
    imgUrl: '',


    certType: {//证书类型
      current: 0,
      names: [
        '常规证书',
        '教师资格证',
        'ACCA/CFA'
      ],
    },



    teacher: true,//选中 ‘教师资格证’
    teacherType: {//教师资格等级
      current: 0,
      names: [
        '幼儿园教师资格证',
        '小学教师资格证',
        '初级中学教师资格证',
        '高级中学教师资格证',
        '中等职业学校教师资格证',
        '中等职业学校实习指导教师资格证',
        '高等学校教师资格证',
        '成人/大学教育的教师资格证'
      ],
    },


    moreInfo: "",//证书全部信息
  },

  onLoad: function (options) {
    var that = this
    var tmpPageInfo = {}

    switch (options.type) {
      case 'QUALIFICATIONS': {
        // tmpType = ""
        break
      }
      case 'SKILL': {
        // tmpType = ""
        break
      }
      case 'COMPETITION': {
        // tmpType = ""
        break
      }
      case 'CET_4_6': {
        // tmpType = ""
        break
      }
      default: {
        wx.showToast({ title: '请求异常，请重试', icon: "none" })
        // setTimeout(() => { wx.navigateBack() }, 1000);
      }
    }

    if (options.type == '' || options.type == null) { } else { that.setData({ pageInfo: tmpPageInfo }) }
  },

  // 步骤切换
  changeStep: function (kk) {
    var that = this
    var tmpString = "stepList.current"
    var resPage = that.data.stepList.current
    if (kk.currentTarget.dataset.type == "back") { resPage-- } else { resPage == 3 ? 0 : (resPage++) }
    that.setData({ [tmpString]: resPage })
  },

  // 证书类型更改
  // radioChange: function (o) { console.log(o.detail.value) },
  typeChange: function ({ detail }) {
    var that = this
    var tmpString = "certType.current"
    this.setData({ [tmpString]: detail.value })
    console.log(that.data.certType.names[detail.value])
  },


  // 教师资格等级更改
  teacherChange: function ({ detail }) {
    var that = this
    var tmpString = "teacherType.current"
    this.setData({ [tmpString]: detail.value })
    console.log(that.data.teacherType.names[detail.value])
  },




  // 更新证书详情
  updateTextarea: function ({ detail }) { this.setData({ moreInfo: detail.value }) },


  // 选择发证时间
  dateChange: function (r) {
    this.setData({
      date: r.detail.value
    })
  },

  // 图片预览(BUG弃用) https://developers.weixin.qq.com/community/develop/doc/000828b50e0e88696e3894dc256400
  // viewImage(e) {
  //   wx.previewImage({
  //     urls: this.data.imgList,
  //     current: e.currentTarget.dataset.url
  //   });
  // },

  // 删除图片
  delImg(e) {
    wx.showModal({
      content: '确定要删除吗？',
      success: res => {
        if (res.confirm) { this.setData({ imgUrl: null }) }
      }
    })
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ imgUrl: res.tempFilePaths[0] })
      }
    });
  },


})