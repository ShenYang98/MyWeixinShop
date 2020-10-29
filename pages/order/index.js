import { request } from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"代发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ]
  },
  onShow(options){
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    const {type}=currentPage.options;
    this.changeTitleByIndex(type-1);
    this.getOrder(type);
  },
  async getOrder(type) {
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    const num = parseInt(type)
    const res = await request({
      url: "/my/orders/all",
      header: { Authorization: token },
      data: { type: num }
    })
    this.setData({
      orders: res.orders.map(item=>{
        return {...item,create_time:new Date(item.create_time*1000).toLocaleString().replace(/\//g,"-")}
      })
    })
  },
  changeTitleByIndex(index) {
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  tabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail
    // 2.重新发送请求 type=1 --> index=0
    this.changeTitleByIndex(index)
    this.getOrder(index+1)
    this.setData({
      currentIndex:index
    })
  },
  handleTabsItemChange(e){
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  },

})