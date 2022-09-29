// miniprogram/pages/clock/clock.js


Page({
  getTime: function(that){
    var time = Date.parse(new Date());
    //var test = new Date("2021-12-25 00:00:00")
    var testtamp = Date.parse(new Date("2022-12-24 00:00:00"))
    if(typeof(testtamp) != 1671811200000){var testtamp = Date.parse(new Date("2022/12/24 00:00:00"))}//ios专属时间格式
    var remain = testtamp - time
    var date = new Date(time);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log(time)
    console.log(typeof(testtamp))
    console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' );
    var d = Math.floor(remain/(24*3600*1000));
    var leave1 = remain % (24*3600*1000);
    var h = Math.floor(leave1/(3600*1000));
    var leave2 = leave1 % (3600*1000);
    var m = Math.floor(leave2/(60*1000));
    var leave3 = leave2 % (60*1000);
    var s = Math.floor(leave3/1000);
    that.setData({
      Y:Y,
      M:M,
      D:D,
      d:d,
      h:h,
      m:m,
      s:s,
      end:false
    })
    console.log(that.data)
    setInterval(function(){
      if(that.data.s + that.data.m + that.data.h + that.data.d === 0){
        that.setData({end:true})}
      else if(that.data.s + that.data.m + that.data.h === 0){
        that.setData({d:that.data.d-1,h:23,m:59,s:59})}
      else if(that.data.s + that.data.m === 0){
        that.setData({h:that.data.h-1,m:59,s:59})}
      else if(that.data.s === 0){
        that.setData({m:that.data.m-1,s:59})}
      else{that.setData({s:that.data.s-1})}
    },1000);
  },
  /**
   * 页面的初始数据
   */
  data: {
    during:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try{
      let that = this
      var pages = getCurrentPages();
      let prevPage = pages[ pages.length - 2 ]; 
      that.setData({
        nickName:prevPage.data.userInfo.nickName
      })}
    catch(err){
      this.setData({
        nickName:"XXX"
      })}
    finally{
      this.getTime(this)}
    //setTimeout(console.log('counter'),1000);
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

  },
})