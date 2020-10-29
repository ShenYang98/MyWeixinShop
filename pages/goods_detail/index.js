import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false
  },
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options = currentPage.options;
      
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

    },
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}})
    this.GoodsInfo = goodsObj;
    let collect = wx.getStorageSync("collect")||[];
      let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
  
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },

  handlePreviewImage(e){
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
      });
      
  },

  // 点击加入购物车
  handleCartAdd(){
    // 1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
      // 2 判断商品对象是否存在于购物车数组中
      let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      if(index===-1){
        // 3 不存在 第一次添加
        this.GoodsInfo.num=1;
        // 商品选中状态
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
      }
      else{
        // 4 已经存在购物车数据 执行num++
        cart[index].num++;
      }
      // 5 把购物车重新添加回缓存中
      wx.setStorageSync("cart", cart);
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        duration: 1500,
        mask: true, //防止用户手抖 疯狂点击按钮
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });
        
  },

  handleCollect(){
    let isCollect = false;
    let collect = wx.getStorageSync("collect")||[];
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
        
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
      
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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