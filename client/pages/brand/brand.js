// pages/brand/brand.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        brandList: [],
        page: 1,
        size: 10,
        totalPages: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBrandList();
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

    getBrandList: function () {
        wx.showLoading({
            title: '加载中...',
        });
        let that = this;
        util.request(api.BrandList, {page: that.data.page, size: that.data.size}).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    brandList: that.data.brandList.concat(res.data.data),
                    totalPages: res.data.totalPages
                });
            }
            wx.hideLoading();
        });
    },
    onReachBottom() {
        if (this.data.totalPages > this.data.page) {
            this.setData({
                page: this.data.page + 1
            });
        } else {
            return false;
        }

        this.getBrandList();
    },
})
