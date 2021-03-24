// pages/ucenter/footprint/footprint.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        footprintList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getFootprintList();
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

    getFootprintList() {
        let that = this;
        util.request(api.FootprintList).then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                that.setData({
                    footprintList: res.data.data
                });
            }
        });
    },
    deleteItem(event) {
        let that = this;
        let footprint = event.currentTarget.dataset.footprint;
        var touchTime = that.data.touch_end - that.data.touch_start;
        console.log(touchTime);
        //如果按下时间大于350为长按
        if (touchTime > 350) {
            wx.showModal({
                title: '',
                content: '要删除所选足迹？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.FootprintDelete, {footprintId: footprint.id}, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 2000
                                });
                                that.getFootprintList();
                            }
                        });
                        console.log('用户点击确定')
                    }
                }
            });
        } else {
            wx.navigateTo({
                url: '/pages/goods/goods?id=' + footprint.goods_id,
            });
        }
    },

    //按下事件开始
    touchStart: function (e) {
        let that = this;
        that.setData({
            touch_start: e.timeStamp
        })
        console.log(e.timeStamp + '- touch-start')
    },
    //按下事件结束
    touchEnd: function (e) {
        let that = this;
        that.setData({
            touch_end: e.timeStamp
        })
        console.log(e.timeStamp + '- touch-end')
    },
})
