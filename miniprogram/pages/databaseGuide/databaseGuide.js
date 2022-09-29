// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  data: {
    Id: '',
    openid: '',
    count: null,
    queryResult: '',
    typle:'',
    count: 0,
    array:[],
    items: [
      {value: 'pdd', name: '0'},
      {value: 'tb', name: '1',},
      {value: 'jd', name: '2'},
    ],
  },

  radioChange(e) {
    var tp = e.detail.value
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    console.log(this.data.openid)
    this.setData({
      typle: tp,
    })
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },
  onQuery: function() {
     const db = wx.cloud.database()
     console.log(this.data.typle)
     // 查询当前用户所有的 counters
     var ta = this.data.typle
     db.collection(ta)
        .aggregate()
        .sample({
          size:3
        })
        .end()
        .then(res => {
          this.setData({
            array:res.list
          })
          console.log(res.list)
        });
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '查询记录失败'
         })
         console.error('[数据库] [查询记录] 失败：', err)
       }
  },

  onRemoveAll: function() {
     if (this.data.openid) {
       const db = wx.cloud.database()
       const _ = db.command
       exports.main = async (event, context) => {
        try{
          console.log('111111111')
          return await db.collection('user').where({
            _openid: _.exists(true)
          }).remove()
        } catch(e) {
          console.log('111111111')
          console.error(e)
        }
      }
        wx.showToast({
          title: '删除完成！',
           })
     } else {
       wx.showToast({
         title: '无记录可删，请见创建一个记录',
       })
     }
  },

  onRemove: function(e) {
    const db = wx.cloud.database()
    var IDs = this.data.array.map((item)=>{return item._id})
    if (IDs.indexOf(e.currentTarget.dataset.id) > -1) {
      db.collection('user').where({
        _id:e.currentTarget.dataset.id
        }).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: data.detail.value.ID+'删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
 },

  copy:function(e){
    var that = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success:function(res){
        wx.getClipboardData({
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            })
            that.setData({
              count : that.data.count + 1
            })
            console.log('count:'+that.data.count)
          },
        })
      }
    })
  },

  toZero:function(){
    this.setData({
      count: 0
    })
    const db = wx.cloud.database()
    db.collection(this.data.typle).where({
      _openid: this.data.openid
    })
    .get({
      success:res=>{
        console.log(res.data.length)
        if(res.data.length === 0){
          db.collection(this.data.typle).add({
            data:{
              link:'NAN',
              time:'',
              count:1}
          })
        }
      }
    })
  }

})