//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    openid:'',
    animationData: {},
    n:0
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      //return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    /*
    wx.login({
      success (res) {
        if (res.code) {
          console.log('登录成功！' + res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    */
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid: ', res.result.openid)
              app.globalData.openid = res.result.openid,
              this.setData({
                openid: res.result.openid
              })
              const db = wx.cloud.database()
              console.log(res.result.openid)
              db.collection('UserInfo').doc(res.result.openid).get().then(res =>{
              this.setData({
              userInfo:res.data,
              hasUserInfo:true,
              avatarUrl:res.data.avatarUrl})
              }).catch(err=>{console.log(err)})
            }
          })
        }
      }
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '获取头像、昵称信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const db = wx.cloud.database()
        if(this.data.hasUserInfo){
          console.log(this.data.openid)
          db.collection('UserInfo').doc(this.data.openid).set({data:{
          nickName: res.userInfo.nickName,
          gender: res.userInfo.gender,
          language: res.userInfo.language,
          province: res.userInfo.province,
          country: res.userInfo.country,
          avatarUrl: res.userInfo.avatarUrl,
          },
          success: function() {
            console.log('跟新成功')
            }
          })
        }
        else{
        db.collection('UserInfo').add({data: {
          _id: this.data.openid,
          nickName: res.userInfo.nickName,
          gender: res.userInfo.gender,
          language: res.userInfo.language,
          province: res.userInfo.province,
          country: res.userInfo.country,
          avatarUrl: res.userInfo.avatarUrl,
        },
        success: function() {
          console.log('新建成功')
        }
      })
      }
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true,
        avatarUrl: res.userInfo.avatarUrl
      })
      console.log('getUserProfile调用成功')
      },
      fail:(res) =>{
        console.log('getUserProfile调用失败'+res.errMsg)
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage(){},
  onShareTimeline(){},

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      },
    })
  },
  mainPicAnimation:function(){
    this.setData({
      n: this.data.n + 5
    })
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
    animation.rotate(360 * (this.data.n)).step()
    this.setData({
      animationData:animation.export()
    })
  }
})
