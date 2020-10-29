// pages/user/index.js
Page({
  data: {
    userinfo:{},
    collectNums:0
  },
  onShow(){
    const userinfo = wx.getStorageSync("userinfo");
    const collect=wx.getStorageSync("collect")||[];
      
    this.setData({userinfo,collectNums:collect.length})
      
  }
})