// pages/ucenter/express/express.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: 1,
        expressInfo: {},
        expressTraces: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.id
        });
        this.getExpressInfo();
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

    getExpressInfo() {
        let that = this;
        util.request(api.OrderExpress, {orderId: that.data.orderId}).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    expressInfo: res.data,
                    expressTraces: res.data.traces
                });
            }
        });
    },
    updateExpress() {
        this.getExpressInfo();
    },
})
