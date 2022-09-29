// miniprogram/pages/photos/photos.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    picURL:'',
    array: [],
    num:0,
    cover: '',
    downBg: "./logoc.png",
    tempHeader: "./mini.jpg",
    picBase:'',
    motto: '检测结果',
    flag: true,
    nickName:'',
  },

  closeMask: function () {
    this.setData({ flag: true })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ]; 
    that.setData({
      nickName:prevPage.data.userInfo.nickName
    })
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      data:{
      grant_type: 'client_credentials',
      client_id: 'GWD8TG6n4E2ZnVlbWR1GtGuC',
      client_secret: 'zh0iRspTezH6F5TqpXF5Ap0y7KKv43Xt',
      },
      success (res) {
          // 在标准输出中查看运行结果
          console.log(res.data.access_token);
          that.setData({
            token: res.data.access_token
          })
      }
   })
   },
  
   delete: function(){
     this.setData({
       cover:'',
       array:[],
     })
   },
   drawTextVertical: function(text,ctx,x,y,addy) {
    console.log(text)
    for(let t in text){
      console.log(t==3)
      ctx.fillText(text[t], x, y)
      y += addy
      if(t==3){
        console.log(text.slice(4,))
        ctx.font = "16px bold";
        ctx.fillStyle = '#C71585';
        ctx.fillText(text.slice(4,), x-15, y)
        break
      }
    }
  },
  detection: function(){
    var that = this
    var num = this.data.num
    console.log(that.data.token)
    wx.getFileSystemManager().readFile({
      filePath: that.data.cover,
      encoding: 'BASE64',
      success: res=>{
      console.log('获取Base64格式文件')
      //console.log(typeof(res.data))
      if(typeof(res.data) != 'string')
        {console.log('非安卓')
          wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect' + '?access_token=' + that.data.token,
          method:'POST',
          data:{
            image:wx.arrayBufferToBase64(res.data),
            image_type:'BASE64',
            face_field:'age,beauty,expression,face_shape,gender,emotion,face_type,mask,race',
          },
          success: res =>{
            console.log(res.data)
            if(res.data.error_code === 0){
              let face = res.data.result.face_list[0]
              that.setData({
               array: [
              face.gender.type,
              face.age,
              face.beauty,
              face.expression.type,
              face.face_shape.type,
              face.race.type,
              face.emotion.type,
              face.face_type.type,
              face.mask.type,
              face.location],
              num: 0
            })
            wx.showToast({
              title: '点击获取结果',
            })
           }else if(res.data.error_code === 222202){
            wx.showToast({
              icon:'error',
              title: '未检测到脸部'
          })  
           }else{
            that.setData({num: num + 1})
            if(num > 5 ){
              wx.showToast({
                icon: 'error',
                title: '网络繁忙，请稍后重试~'
            })    
            }else{
              //setTimeout(console.log('停1s'),1000)
              that.detection()
              console.log('重新发起请求') 
                  }
                }
              }
            })
        }
      else{
      wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect' + '?access_token=' + that.data.token,
      method:'POST',
      data:{
        image:res.data,
        image_type:'BASE64',
        face_field:'age,beauty,expression,face_shape,gender,emotion,face_type,mask,race',
      },
      success: res =>{
        console.log(res.data)
        if(res.data.error_code === 0){
          let face = res.data.result.face_list[0]
          that.setData({
           array: [
          face.gender.type,
          face.age,
          face.beauty,
          face.expression.type,
          face.face_shape.type,
          face.race.type,
          face.emotion.type,
          face.face_type.type,
          face.mask.type,
          face.location],
          num: 0
        })
        wx.showToast({
          title: '点击获取结果',
        })
       }else if(res.data.error_code === 222202){
        wx.showToast({
          icon:'error',
          title: '未检测到脸部'
      })  
       }else{
        that.setData({num: num + 1})
        if(num > 5 ){
          wx.showToast({
            icon: 'error',
            title: '网络繁忙，请稍后重试~'
        })    
        }else{
          //setTimeout(console.log('停1s'),1000)
          that.detection()
          console.log('重新发起请求') 
              }
            }
          }
        })
      }  }
    })
  },
   drawIMG: function () {
    let that = this
    //console.log('draw'+that.data.array)
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' );
    let json = {
      cover: "../../images/mini.jpg",//that.data.cover,
      //downBg: "./logoc.png",
      tempHeader: "../../images/mini.jpg",
      katon:'../../images/katon.png',
      age: that.data.array[1],
      gender: that.data.array[0],
      beauty: that.data.array[2],
      expression:that.data.array[3],
      faceshape:that.data.array[4],
      race:that.data.array[5],
      emotion:that.data.array[6],
      facetype:that.data.array[7],
      mask:that.data.array[8],
      location:that.data.array[9],
      Y:Y,
      M:M,
      D:D,
    };
    //console.log(json)
    wx.showLoading({
      title: '海报生成中...',
    })
    console.log(json);
    //选取画板
    const query = wx.createSelectorQuery()
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        let befor = 0;
        canvas.width = res[0].width;
        canvas.height = res[0].height;
        let sq1 = res[0].width*0.5-10;
        let sq2 = (res[0].width*0.5-10)*0.7
        //ctx.clearRect(0, 0, 320, 410); //清空画板
        const grd = ctx.createLinearGradient(0, 0,res[0].width, res[0].height)
        grd.addColorStop(0, '#D0E6A5')
        grd.addColorStop(0.2, '#D0E6A5')
        grd.addColorStop(1, '#FFDD94')
        ctx.fillStyle = grd
        //ctx.fillStyle = '#f0efd1';//#f0efd1
        ctx.fillRect(0, 0, res[0].width, res[0].height)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 0.3
        ctx.strokeRect(10, 100, res[0].width-20, res[0].width*1.15)
        ctx.strokeRect(10, 100, res[0].width*0.65, 30)//ID
        ctx.strokeRect(res[0].width*0.65+10, 100, res[0].width*0.35-20, 30)//性别
        ctx.strokeRect(res[0].width*0.5, 130, sq1, sq1)//照片
        ctx.strokeRect(10, 130, res[0].width*0.5-10, (res[0].width*0.5-10)*0.65)//score
        befor = (res[0].width*0.5-10)*0.65
        ctx.strokeRect(10, 130+befor, 30,res[0].width*1.15-befor-30 -sq2 )//左框
        ctx.strokeRect(10, 100+res[0].width*1.15-sq2, sq2,sq2 )//二维码
        ctx.strokeRect(res[0].width*0.65+10, 130+sq1, res[0].width*0.35-20,res[0].width*1.15-30-sq1 )//时间
        ctx.strokeRect(10+sq2,100+res[0].width*1.15-sq2*0.5,res[0].width-20-sq2-(res[0].width*0.35-20),sq2*0.5)
        ctx.stroke()
        /*
        //写底部背景
        console.log('背景图')
        const bgImg = canvas.createImage();
        bgImg.src = json.downBg;
        let bgImgPo = await new Promise((resolve, reject) => {
          bgImg.onload = () => {
            resolve(bgImg)
          }
          bgImg.onerror = (e) => {
            reject(e)
          }
        });
        ctx.drawImage(bgImgPo, 0, 0, 320, 410);*/
        //底部二维码
        const scanImg = canvas.createImage();
        scanImg.src = json.tempHeader;
        let scanImgPo = await new Promise((resolve, reject) => {
          scanImg.onload = () => {
            resolve(scanImg)
          }
          scanImg.onerror = (e) => {
            reject(e)
          }
        });
        ctx.drawImage(scanImgPo, 10+2.5, 100+res[0].width*1.15-sq2+2.5, sq2-5, sq2-5)
        //katon
        const kaImg = canvas.createImage();
        kaImg.src = json.katon;
        let kaImgPo = await new Promise((resolve, reject) => {
          kaImg.onload = () => {
            resolve(kaImg)
          }
          kaImg.onerror = (e) => {
            reject(e)
          }
        });
        ctx.drawImage(kaImgPo,res[0].width*0.65+10+2.5,130+sq1+res[0].width*1.15-30-sq1-(res[0].width*0.35-20)+2.5,res[0].width*0.35-20-5, res[0].width*0.35-20-5)
        //用户昵称
        wx.loadFontFace({
          family: 'family',
          source: 'url("https://static.heytea.com/taro_trial/v1/font/WenYue-XinQingNianTi-NC-W8_1.otf")',
          success:res=>{
            console.log('字体下载成功')
          }
        })
        ctx.font = "16px family"; //设置字体大小，默认10
        ctx.fillStyle = '#000'; //文字颜色：默认黑色     
        ctx.fillText('ID：'+that.data.nickName, 20, 120,)
        //性别
        var text
        if(json.gender === 'female'){
          text = '女'
        }else{text = '男'}
        ctx.fillText('性别：'+text, res[0].width*0.65+10+15, 120)//绘制文本
        ctx.fillText('BeautyScore', 60, 170+(res[0].width*0.5-10)*0.65/2)
        befor += 10
        //年龄
        ctx.fillText('#'+json.age+"岁#", 60, 150+befor)    
        //肤色/人脸类型
        if(json.race==='yellow'){text='#亚洲的#'}
        else if(json.race==='white'){text='#欧美的#'}
        else if(json.race==='black'){text='#非洲的#'}
        ctx.fillText(text,60,170+befor)
        //表情
        if(json.expression==='none'){text='#面无表情#'}
        else if(json.expression==='smile'){text='#微笑#'}
        else if(json.expression==='laugh'){text='#哈哈大笑#'}
        ctx.fillText(text,60,190+befor)
        //脸型
        if(json.faceshape==='square'){text='一团和气的方方方型脸'}
        else if(json.faceshape==='triangle'){text='亲切温和的三角形脸'}
        else if(json.faceshape==='oval'){text='清秀典雅的鹅蛋脸'}
        else if(json.faceshape==='heart'){text='灵动甜美的心形脸'}
        else if(json.faceshape=='round'){text='福气满满的圆形脸'}
        ctx.fillText('#'+text+'#',60,210+befor)
        //情绪
        if(json.emotion==='none'){text='莫的感情'}
        else{text=json.emotion}
        ctx.fillText('#'+text+'#',60,230+befor)
        //
        if(json.facetype==='human'){text='真人'}
        else if(json.facetype==='cartoon'){text='卡通人物'}
        ctx.fillText('#'+text+'#',60,250+befor)
        //口罩
        ctx.textAlign = 'center'
        ctx.textBaseline = 'center'   
        if(json.mask===0){text='未戴口罩'}
        else{text='戴了口罩'}
        ctx.fillText('#'+text+'#',10+sq2+0.5*(res[0].width-20-sq2-(res[0].width*0.35-20)),100+res[0].width*1.15-sq2*0.6)
        //date
        ctx.textAlign = 'left'
        ctx.fillText('@这儿全都有',10,20)
        ctx.textBaseline = 'center'        
        ctx.fillText('TM:',res[0].width*0.65+10,150+sq1)
        ctx.textAlign = 'center'
        let index = json.M*1-1
        let month = ['January','February','March','April','May','June','July','August','September','October','November','December']
        ctx.fillText(month[index],res[0].width*0.65+10+(res[0].width*0.35-20)*0.5,170+sq1)
        ctx.fillText(json.D,res[0].width*0.65+10+(res[0].width*0.35-20)*0.5,190+sq1)
        ctx.font = "25px bold";//10px sans-serif
        ctx.fillText(json.Y,res[0].width*0.65+10+(res[0].width*0.35-20)*0.5,220+sq1)
        //scan(10+sq2,100+res[0].width*1.15-sq2*0.5,res[0].width-20-sq2-(res[0].width*0.35-20),sq2*0.5)
        ctx.font = '10px sans-serif'
        ctx.fillText('长按扫一扫',10+sq2+0.5*(res[0].width-20-sq2-(res[0].width*0.35-20)),100+res[0].width*1.15-sq2*0.5+0.4*(sq2*0.5))
        ctx.fillText('Pick Me',10+sq2+0.5*(res[0].width-20-sq2-(res[0].width*0.35-20)),100+res[0].width*1.15-sq2*0.5+0.7*(sq2*0.5))
        //颜值
        ctx.font = "40px bold";
        ctx.textAlign = 'center'
        ctx.textBaseline = 'center'
        ctx.fillText(json.beauty, 10+(res[0].width*0.5-10)*0.5, 130+(res[0].width*0.5-10)*0.65/1.65)
        //10, 130, res[0].width*0.5-10, (res[0].width*0.5-10)*0.65
        ctx.fillText('"2021针不戳"',res[0].width*0.5,70)
        //获取用户头像
        /**
         * 生成微信头像的公共方法
         * @param {string} headImageLocal 微信头像
         */
        function canvasWxHeader(headImageLocal) {
          const headerImg = canvas.createImage();
          let square = 150
          let sx = 0
          let sy = 0
          let center = 0
          if(json.location.width>json.location.height){square=json.location.width}
          else{square=json.location.height}
          //console.log(headImageLocal)
          headerImg.src = headImageLocal;
          headerImg.onload = () => {
          //人脸所在位置偏
            let cx = json.location.left + json.location.width/2
            let cy = json.location.top + json.location.height/2
            sx = cx - square
            sy = cy - square*1.2
            /*
            if(json.location.left<10){square=cx*2-20}else{xx = json.location.left-10}
            if(json.location.top<10){square=cy*2-20}else{yy = json.location.top-10}
            if(json.location.left+square+10>headerImg.width){square=(headerImg.width-cx)*2-20, xx = cx-(square+20)/2}else{xx=json.location.left-10}
            if(json.location.top+square+10>headerImg.height){square=(headerImg.height-cy)*2-20, yy = cy-(square+20)/2}else{yy=json.location.top-10}
            //square += 10*/
            ctx.save();
            //ctx.drawImage(headerImg, json.location.left-5, json.location.top-40,square,square, 5, 5, 150, 150);
            //ctx.drawImage(headerImg,json.location.left,json.location.top,square,square,res[0].width*0.5+2.5, 130+2.5, sq1-5, sq1-5)
            ctx.drawImage(headerImg,sx,sy,square*2,square*2,res[0].width*0.5+2.5, 130+2.5, sq1-5, sq1-5)
            wx.hideLoading();
          }
        }
        canvasWxHeader(that.data.cover);
      });
      that.setData({flag:false})
  },
   onUpLoad: function() {
     let that = this
     let num = that.data.num
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      success: chooseResult => {
        console.log(chooseResult.tempFilePaths[0])
        that.setData({
          cover:chooseResult.tempFilePaths[0]
        });
      }
        /*
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: 'my-photo.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log('上传成功', res)
            that.setData({
              picID: res.fileID
            })
            wx.cloud.getTempFileURL({
              fileList:[{
                fileID: res.fileID,
                maxAge: 5, 
              }]
            }).then(res =>{
              that.setData({
                picURL: res.fileList[0].tempFileURL,
              })
            }).catch(console.error(res.errMsg))
            },
            fail:res=>{
              console.log(res.errMsg)
              wx.showToast({
                icon: 'none',
                title: res.errMsg
            })              
            }
          })
        }
      })
  },
  deleteIMG: function(e){
    wx.cloud.deleteFile({
      fileList: [e.data.fileID]
    }).then(res => {
      // handle success
      console.log(res.fileList+'已删除')
    }).catch(error => {
      // handle error
      */
    })
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