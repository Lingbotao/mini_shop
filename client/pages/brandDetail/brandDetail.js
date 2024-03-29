// pages/brandDetail/brandDetail.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        brand: {},
        goodsList: [],
        page: 1,
        size: 1000
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            id: parseInt(options.id)
        });
        this.getBrand();
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

    getBrand: function () {
        let that = this;
        util.request(api.BrandDetail, {id: that.data.id}).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    brand: res.data.brand
                });

                that.getGoodsList();
            }
        });
    },
    getGoodsList() {
        var that = this;

        util.request(api.GoodsList, {brandId: that.data.id, page: that.data.page, size: that.data.size})
            .then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        goodsList: res.data.goodsList
                    });
                }
            });
    },
})
