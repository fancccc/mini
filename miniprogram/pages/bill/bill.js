// miniprogram/pages/bill/bill.js

Page({
  mixins: [require('../../mixin/common')],
  /**
   * 页面的初始数据
   */
  data: {
    t:'餐饮日常',
    type: ['餐饮日常','居家日常','购物消费','房租水电','汽车交通','医疗药品','礼物红包'],
    color: ['#FF9966','#99CCCC','#FFCCCC','#99CCFF','#CCCCCC','#CCCCFF','#6699CC'],
    icos:[976,308,634,76,625,310,280],//976餐饮 280礼物 634购物 625交通 310医疗 308居家 76房租
    cs: [1],
    nowcolor: '#FF9966',
    nowtime: new Date().toString().slice(0,15),
    count: [7,8,9,'Backspace',4,5,6,'+',1,2,3,'=','.',0,'清空','完成'],
    input_str: '0',
    input_num: 0,
    panel1: true,
    panel2: false,
    panel3: false,
    panel4: false,
  },

  
  tab1: function(){
    this.setData({
      panel1: true,
      panel2: false,
      panel3: false,
      panel4: false
    })
  },
  tab2: function(){
    this.setData({
      panel2: true,
      panel1: false,
      panel3: false,
      panel4: false
    })
  },
  tab3: function(){
    this.setData({
      panel3: true,
      panel2: false,
      panel1: false,
      panel4: false
    })
  },
  toAdd: function(){
    this.setData({
      addPage: true
    })
  },
  getCount: function(e){
    console.log(e.currentTarget.dataset.value)
    let input_num = this.data.input_num
    let input_str = this.data.input_str
    /*
    if(this.data.input_str == '0'){
      var input_str = ''
    }else{
      var input_str = this.data.input_str
    }*/
    let i = e.currentTarget.dataset.value
    if([1,2,3,4,5,6,7,8,9,0,'.','+','='].indexOf(i) == -1){
      if(i == 'Backspace'){
        if(input_str.length <= 1){
          input_str = '0'
        }else{
          input_str = input_str.slice(0,-1)
          let lis = input_str.split('+')
          input_num = 0
          for(let j=0; j<lis.length; j++){
            input_num += Number(lis[j])
          }
        }
      }
      else if(i == '清空'){
        input_str = '0'
        input_num = 0
      }
      else if(i == '完成'){
        if(input_num > 0){
          this.upLoadBill()
          input_str = '0'
          input_num = 0
          this.setData({
            addPage: false
          })
        }else{
          wx.showToast({
            title: '账单金额有误',
            icon: 'error'
          })
        }
      }
    }
    else{//输入[1,2,3,4,5,6,7,8,9,0,'.','+','=']
        if(i != '='){
        input_str = input_str + i.toString()
      }
      let lis = input_str.split('+')
      input_num = 0
      if(!isNaN(input_str)){
          input_num = Number(input_str)
        }else{
          for(let j=0; j<lis.length; j++){
            input_num += Number(lis[j])
          }
        }
    }
    if(input_num != 0 & input_str[0] === '0'){
      input_str = input_str.slice(1)
    }
    this.setData({
      input_str: input_str,
      input_num: input_num
    })
  },
  getType: function(e){
    console.log(e.currentTarget.dataset)
    let cs = [0, 0, 0, 0, 0, 0, 0]
    cs[e.currentTarget.dataset.type] = 1
    this.setData({
      t: this.data.type[e.currentTarget.dataset.type],
      cs: cs,
      nowcolor: this.data.color[e.currentTarget.dataset.type]
    })
  },
  getBill: function(e){
    console.log(e.detail.value)
    this.setData({
      bill:Number(e.detail.value)
    })
  },
  getDescribe: function(e){
    console.log(e)
    this.setData({
      describe:e.detail.value
    })
  },
  upLoadBill: function(){
    const db = wx.cloud.database()
    db.collection('bill').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        bill: this.data.input_num,
        temp: Date.parse(new Date()),
        type: this.data.t, 
        describe: this.data.describe
      }
    })
    .then(res => {
      console.log(res)
      this.setData({
        bill:NaN
      })
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
    })
  },

  selectBill: function(){
    return new Promise((resolve, reject) =>{
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('bill').where({
      temp:_.gt(Date.parse(new Date())-30*24*60*60*1000)
    }
    ).get().then(res => {
      let type_index=[]
      for(let i=0; i<res.data.length; i++){
      type_index.push(this.data.type.indexOf(res.data[i].type))
      }
      this.setData({
        result:res.data,
        type_index:type_index
      })
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      resolve(res)
    })
  })
  },

  addBill: function () {
    this.selectBill().then(res => {
      let allBill = res.data[0].bill
      let date = new Date(res.data[0].temp).toString().slice(0,15)
      let time = [new Date(res.data[0].temp).toString().slice(0,15)]
      for(let i=1; i<res.data.length ;i++){
        allBill += res.data[i].bill
        if(new Date(res.data[i].temp).toString().slice(0,15) == date){
          time.push('')
        }else{
          time.push(new Date(res.data[i].temp).toString().slice(0,15))
          date = new Date(res.data[i].temp).toString().slice(0,15)
        }
      }
      console.log('res',this.data.result.length)
      console.log('allBill',allBill)
      this.setData({
        allBill: allBill,
        //result: newData,
        time:time
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.addBill()
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
    //this.selectBill()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})