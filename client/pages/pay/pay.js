// pages/pay/pay.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: 0,
        actualPrice: 0.00
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
            actualPrice: options.actualPrice
        })
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

    //向服务请求支付参数
    requestPayParam() {
        let that = this;
        util.request(api.PayPrepayId, {orderId: that.data.orderId, payType: 1}).then(function (res) {
            if (res.errno === 0) {
                let payParam = res.data;
                wx.requestPayment({
                    'timeStamp': payParam.timeStamp,
                    'nonceStr': payParam.timeStamp,
                    'package': payParam.nonceStr,
                    'signType': payParam.signType,
                    'paySign': payParam.paySign,
                    'success': function (res) {
                        wx.redirectTo({
                            url: '/pages/payResult/payResult?status=true',
                        })
                    },
                    'fail': function (res) {
                        wx.redirectTo({
                            url: '/pages/payResult/payResult?status=false',
                        })
                    }
                })
            }
        });
    },
    startPay() {
        this.requestPayParam();
    }
})
