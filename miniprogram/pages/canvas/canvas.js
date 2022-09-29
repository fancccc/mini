// miniprogram/pages/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'微信昵称未授权'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var photos = require('../photos/photos.js')
    var pages = getCurrentPages();
    var prevPage = pages[ pages.length - 2 ];
    console.log(prevPage.data)
    //this.data.array = prevPage.data
    this.setData({
      downBG:'../../images/logoc.png',
      tempHeader:'../../images/mini.jpg',
      array:prevPage.data.array,
      nickName:prevPage.data.nickName,
    })
    prevPage.drawIMG()
  },
  modalCandel:function(){
    this.setData({mod:true})
    },
    /**
       * 获取用户保存相册权限
       */
    getPhotosAuthorize: function () {
      let self = this;
      wx.getSetting({
        success(res) {
          console.log(res)
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                console.log('授权成功')
                self.saveImg();
              },
              //用户拒绝
              fail() {
                console.log("用户再次拒绝")
              }
            })
          } else {
            self.saveImg();
          }
        }
      })
    },
    /**
     * 保存到相册
     */
    async saveImg() {
      let self = this;
      const query = wx.createSelectorQuery();
      const canvasObj = await new Promise((resolve, reject) => {
        query.select('#posterCanvas')
          .fields({ node: true, size: true })
          .exec(async (res) => {
            resolve(res[0].node);
          })
      });
      console.log(canvasObj);
      wx.canvasToTempFilePath({
        canvas: canvasObj, //现在的写法
        success: (res) => {
          console.log(res);
          self.setData({ canClose: true });
          //保存图片
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 2000
              })
              self.setData({flag:true})
            },
            fail: function (err) {
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("当初用户拒绝，再次发起授权")
              } else {
                util.showToast("请截屏保存分享");
              }
            },
            complete(res) {
              wx.hideLoading();
              console.log(res);
            }
          })
        },
        fail(res) {
          console.log(res);
        }
      }, this)
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})