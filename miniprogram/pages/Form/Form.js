
Page({
  data: {
    dbcount:0,
    count:0,
    focus: false,
    inputValue: ''
  },
  save:function(e){
    if(this.data.count < 3){
    const db = wx.cloud.database()
    var pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ]; 
    var tp = prevPage.data.typle
    var openid = prevPage.data.openid
    console.log('openid'+openid)
    /*db.collection(tp)
      .where({_openid:openid}).get({
        success:res=>{console.log('res:'+res.data[0].count);this.setData({dbcount:res.data[0].count})}
      })*/
    db.collection(tp)
      .where({_openid:openid})     
      .update({
       data: {
         time:'',
         link: e.detail.value.link,
         count: this.data.dbcount+1,
       },
       success: res => {
         // 在返回结果中会包含新创建的记录的 _id
         this.setData({
           count:this.data.count + 1
         })
         wx.showToast({
           title: '提交成功！',
         })
         console.log('[数据库] [更新记录] 成功，记录openid: ', res)
       },
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '提交失败~'
         })
         console.error('[数据库] [更新记录] 失败：', err)
       }
     })
    }
    else{
      console.log('count'+this.data.count)
      wx.showToast({
        icon: 'none',
        title: '提交过于频繁（超过3次）~'
      })
    }
  },

})