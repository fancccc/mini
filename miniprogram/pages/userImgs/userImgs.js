// miniprogram/pages/userImgs/userImgs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open : false,
    moreNum:6,
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ];
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);  
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    let imageUrl = prevPage.data.userInfo.avatarUrl.split('/')
    imageUrl[imageUrl.length - 1] = 0
    imageUrl = imageUrl.join('/')
    prevPage.data.userInfo.avatarUrl = imageUrl
    console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' );
    console.log(date)
    console.log(imageUrl)
    this.setData({
      openid:prevPage.data.openid,
      userInfo:prevPage.data.userInfo,
      date:Y + '年'  + M+ '月' + D+ '日'
    })
    wx.downloadFile({
      url: this.data.userInfo.avatarUrl,
      success: res=>{this.setData({tempath:res.tempFilePath})}
    })
  },
  tap_ch: function(e){
    if(this.data.open){
      this.setData({
        open : false
      });
    }else{
      this.setData({
        open : true
      });
    }
  },
  uploadImg: function(f){
    var timestamp = Date.parse(new Date());
    wx.cloud.uploadFile({
      cloudPath: 'userImg/' + this.data.openid + timestamp + '.png', 
      filePath: this.data.tempath,
      success: res => {
        console.log(res.fileID,'上传成功！')
        const db = wx.cloud.database()
        db.collection('UserImg').add({
          data:{
            fileName: this.data.openid + timestamp + '.png',
            fileID: res.fileID,
            date:this.data.date
          },
          success: function(res) {
            console.log('数据库写入成功！')
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1500
            })
          }
        })
      },
      fail: res=>console.error
    })
  },

  enquireImg: function(){
    console.log(this.data.openid)
    const db = wx.cloud.database()
    db.collection('UserImg').where({
      _openid:this.data.openid
    }).get().then(res=>{
            console.log(res)
            this.setData({
              length:res.data.length,
              Imginfo:res.data,
              more:false
              })
            })
  },

  saveImg: function(e){
    wx.cloud.downloadFile({
      fileID: e.currentTarget.dataset.couldid, // 文件 ID
      success: res => {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res) {console.log('success') },
          fail:res=>{console.log(res)}
        })
      },
      fail: console.error
    })
  },

  deleteImg: function(e){
    wx.cloud.deleteFile({
      fileList: [e.currentTarget.dataset.couldid],
      success: res => {
        // handle success
        console.log(res.fileList)
        const db = wx.cloud.database()
        db.collection('UserImg').where({fileID:res.fileList[0].fileID}).remove().catch(res=>{console.log(res)})
        this.data.Imginfo.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          Imginfo:this.data.Imginfo
        })
        console.log(e.currentTarget.dataset.index)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: console.error
    })
  },
  deleteDb: function(id){
    const db = wx.cloud.database()
    db.collection('UserImg').where({fileID:id}).remove().then(res=>{console.log(res)})
  },

  moreImg:function(){    
    this.setData({
    more:true,
    moreID:'cloud://eachhelp-9o1rc.6561-eachhelp-9o1rc-1304125933/moreImg/',
    Imginfo:false
    })
    var animation = wx.createAnimation({})
    animation.opacity(0.2).translateX(30).step()
    this.setData({
      animationData:animation.export()
    })
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
    if(this.data.more){
    this.setData({
      end:true,
      moreNum: this.data.moreNum + 6
    })
    console.log('end')
   }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})