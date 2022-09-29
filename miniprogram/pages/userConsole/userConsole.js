// pages/userConsole/userConsole.js
Page({

  data: {
    openid: '',
    hz:''
  },

  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid
    })
  }
})
