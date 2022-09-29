// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  nickName = ''
  avatarUrl = ''
  db.collection('UserInfo').doc(wxContext.OPENID).get({
    success: function(res) {
      // res.data 包含该记录的数据
      console.log(res.data)
      nickName = res.data.nickName
      avatarUrl = res.data.avatarUrl
    },
    fail:(res)=>{
      console.log('查询失败')
      nickName = 'fail'
    }
  })
  return{
    nickName:nickName,
    avatarUrl:avatarUrl,
    openid:wxContext.OPENID
  }
}