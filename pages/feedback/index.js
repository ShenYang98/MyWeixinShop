// pages/feedback/index.js
Page({

  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      },
    ],
    chooseImgs:[],
    textVal:""
  },
  UploadImgs:[],
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
    
  },

  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result)
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      },
      fail: () => {},
      complete: () => {}
    });
        
    
  },

  handleRemoveImg(e){
    
    const {index}=e.currentTarget.dataset;
    
    let {chooseImgs}=this.data;
    
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },

  handleTextInput(e){
    this.setData({
      textVal:e.detail.value,
    })
  },

  handleFormSubmit(){
    const {textVal,chooseImgs}=this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon:'none',
        mask:true,
        duration: 1000,
      });
      return;
    }
    wx.showLoading({
      title: '正在上传中',
      mask:true
    })
    if (chooseImgs!=0) {
      chooseImgs.forEach((v,i)=>{
      
      wx.uploadFile({
        filePath: v,
        name: 'image',
        url: 'https://img.coolcr.cn/api/upload',
        formData:{}, 
        success:(res)=>{
          console.log(res);
          let url=JSON.parse (res.data).url;
          this.UploadImgs.push(url);
          
          if (i===chooseImgs.length-1) {
            wx.hideLoading( );
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              image: '',
              duration: 3000,
              mask: true,
              success: (result) => {
                
              },
              fail: () => {},
              complete: () => {
                wx.navigateBack({
                  delta:1
                })
              }
            });
              
            this.setData({
              textVal:"",
              chooseImgs:[]
            })
           
          }
        }
      })
    });
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta:1
      })
    }
    
  },
})