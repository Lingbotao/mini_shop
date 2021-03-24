// pages/shopping/address/address.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAddressList();
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

    },

    getAddressList() {
        let that = this;
        util.request(api.AddressList).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    addressList: res.data
                });
            }
        });
    },
    addressAddOrUpdate(event) {
        console.log(event)
        wx.navigateTo({
            url: '/pages/shopping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
        })
    },
    selectAddress(event) {
        console.log(event.currentTarget.dataset.addressId);

        try {
            wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
        } catch (e) {

        }

        //选择该收货地址
        wx.redirectTo({
            url: '/pages/shopping/checkout/checkout'
        })
    },
})
