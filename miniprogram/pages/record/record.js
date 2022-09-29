
const app = getApp()
Page({
  mixins: [require('../../mixin/common')],
  getTime: function(that){
    var time = Date.parse(new Date());
    var date = new Date(time);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log(time)
    console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' );
    that.setData({
        time:time,
        Y:Y,
        M:M,
        D:D,
        today:Y + '年'  + M+ '月' + D+ '日'}
    )
    //return time
  },
  getDATA:function(){
    const db = wx.cloud.database()
    db.collection('record').where({
      _openid:this.data.openid,
      today:this.data.today
    }).get().then(res=>{
            var b = 0
            var e = 0
            var minute = 0
            for(var i in res.data){
              console.log(res.data[i])
              if(res.data[i].today === this.data.today){
                if(res.data[i].etamp){e = e + res.data[i].etamp}
                if(res.data[i].btamp){b = b + res.data[i].btamp}                
                console.log(res.data[i].btamp)
              }
            }
            minute = Math.floor((e - b) / (1000 * 60));
            //parseInt((minute % (1000 * 60 * 60) / 1000 * 60))//
            console.log("(b - e):",minute)
            this.setData({
              minute:minute
            })
            console.log(res)
            this.setData({
              array:res.data
              })
            })
    },

  begintimeDATA:function(that){
    const db = wx.cloud.database()
    db.collection('record').add({
      data:{
        //date:that.data.date,
        begintime:new Date().toLocaleString(),
        type:'begin',
        today:this.data.today,
        btamp:Date.parse(new Date)
      }
    })
    console.log('Begin Sucess Add!')
  },

  endtimeDATA:function(that){
    const db = wx.cloud.database()
    db.collection('record').add({
      data:{
        //date:that.data.date,
        endtime:new Date().toLocaleString(),
        type:'end',
        today:this.data.today,
        etamp:Date.parse(new Date)
      }
    })
    console.log('End Sucess Add!')
  },
  /**
   * 页面的初始数据
   */
  data: {
    nowtime: 0,
    minute:0,
    begin:'begin',
    end:'end',
    array:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 获取用户信息
     this.getTime(this)
     if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })}
      else{
     wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid(record): ', res.result.openid)
              //app.globalData.openid = res.result.openid,
              this.setData({
                openid: res.result.openid
              })
            }
          })
        }
      }
    })}
    //this.getDATA()
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