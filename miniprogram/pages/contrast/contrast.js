// miniprogram/pages/contrast/contrast.js
import NumberAnimate from "../../pages/contrast/NumberAnimate";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    pic1:'../../images/add2.jpg',//../../images/choose.png
    pic2:'../../images/add2.jpg',//../../images/choose.png
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    wx.request({
      url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=GWD8TG6n4E2ZnVlbWR1GtGuC&client_secret=zh0iRspTezH6F5TqpXF5Ap0y7KKv43Xt',
      success(res){
        console.log(res.data.access_token)
        that.setData({
          token:res.data.access_token
        })
      }
    })
  },
  choosePIC1: function(){
    var that = this
    console.log('choose')
    wx.chooseImage({
      count: 1,
      sizeType:['compressed'],
      success(res){
        console.log('success')
        that.setData({
          pic1:res.tempFilePaths[0],
          sim:'',
          num1:'',
          per:'',
          Complete:'',
        })
        wx.getFileSystemManager().readFile({
          filePath:res.tempFilePaths[0],
          encoding:'BASE64',
          success(res){
            //var pic1 = res.data
            that.setData({pic11:res.data})
          },
          fail(res){
            console.log(res.errMsg)
          }
        })
      }
    })
  },

  choosePIC2: function(){
    var that = this
    console.log('choose')
    wx.chooseImage({
      count: 1,
      sizeType:['compressed'],
      success(res){
        console.log('success')
        that.setData({
          pic2:res.tempFilePaths[0],
          sim:'',
          num1:'',
          per:'',
          Complete:'',
        })
        wx.getFileSystemManager().readFile({
          filePath:res.tempFilePaths[0],
          encoding:'BASE64',
          success(res){
            //var pic1 = res.data
            that.setData({pic12:res.data})
          },
          fail(res){
            console.log(res.errMsg)
          }
        })
      }
    })
  },
  contrast:function() {
    let that = this
    let pic1 = this.data.pic11
    let pic2 = this.data.pic12
    //console.log(pic1)
    if(typeof(pic1) != 'string'){
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/match?access_token='+this.data.token,
        method:'POST',
        data:[
          {image:wx.arrayBufferToBase64(pic1),image_type:'BASE64'},
          {image:wx.arrayBufferToBase64(pic2),image_type:'BASE64'}],
        success(res){
          console.log(res.data)
          if(res.data.error_code == 0){
          that.setData({
            result:res.data.result,
            per:'%'
          })
          let num1 = res.data.result.score.toFixed(3)*1;
          let n1 = new NumberAnimate({
              from:num1,//开始时的数字
              speed:2000,// 总时间
              refreshTime:100,//  刷新一次的时间
              decimals:2,//小数点后的位数
              onUpdate:()=>{//更新回调函数
                that.setData({
                  num1:n1.tempValue
                });
              },
              onComplete:()=>{//完成回调函数
                  that.setData({
                    Complete:" 检测完毕",
                    sim:'相似度达'
                  });
              }
          })}else{wx.showToast({
            icon:'error',
            title: res.data.error_msg,
          })}
        },
        fail(res){
          console.log( 'res'+res)
          }
      })
    }
    else{
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/match?access_token='+this.data.token,
      method:'POST',
      data:[
        {image:pic1,image_type:'BASE64'},
        {image:pic2,image_type:'BASE64'}],
      success(res){
        console.log(res.data)
        if(res.data.error_code == 0){
        that.setData({
          result:res.data.result,
          per:'%'
        })
        let num1 = res.data.result.score.toFixed(3)*1;
        let n1 = new NumberAnimate({
            from:num1,//开始时的数字
            speed:2000,// 总时间
            refreshTime:100,//  刷新一次的时间
            decimals:2,//小数点后的位数
            onUpdate:()=>{//更新回调函数
              that.setData({
                num1:n1.tempValue
              });
            },
            onComplete:()=>{//完成回调函数
                that.setData({
                  Complete:" 检测完毕",
                  sim:'相似度达'
                });
            }
        })}else{wx.showToast({
          icon:'error',
          title: res.data.error_msg,
        })}
      },
      fail(res){
        console.log( 'res'+res)
        }
    })}
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