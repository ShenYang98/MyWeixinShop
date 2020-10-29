import { request } from "../../request/index";


import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js"

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    cart=cart.filter(v=>v.checked);
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    this.setData({
      address
    })
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  async handleOrderPay(){
    try {
     const token=wx.getStorageSync("token");
     if(!token){
       wx.navigateTo({
         url:'/pages/auth/index'
       });
       return;
     }
     const header={Authorization:token};
     const order_price=this.data.totalPrice;
     const consignee_addr=this.data.address.all;
     const cart=this.data.cart;
     let goods=[];
     cart.forEach(v=>goods.push({
       goods_id:v.goods_id,
       goods_number:v.num,
       goods_price:v.goods_price
     }))
     const orderParams={order_price,consignee_addr,goods};
     
     const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams,header});
     
     
     const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number},header});
     const res = await requestPayment(pay);
     console.log(res)

     const result=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
     
     wx.showToast({ title: '支付成功'});
     let newcart=wx.getStorageSync("cart");
     newcart=newcart.filter(v=>!v.checked);
     wx.setStorageSync('cart', newcart)
 
 
     wx.navigateTo({
       url: '/pages/order/index',
     })
    } catch (err) {
     wx.showToast({ title: '没有支付权限哦~',icon: 'none' });
     console.log(err); 
    }
   },
      
    // // const token = wx.getStorageSync("token");
    // const token="aaa"
    //   if(!token){
    //     wx.navigateTo({
    //       url: '/pages/auth/index',
    //       success: (result) => {
            
    //       },
    //       fail: () => {},
    //       complete: () => {}
    //     });
          
    //     return;
    //   }
  }
)