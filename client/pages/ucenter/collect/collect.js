// pages/ucenter/collect/collect.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeId: 0,
        collectList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCollectList();

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

    getCollectList() {
        let that = this;
        util.request(api.CollectList, {typeId: that.data.typeId}).then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                that.setData({
                    collectList: res.data.data
                });
            }
        });
    },

    openGoods(event) {

        let that = this;
        let goodsId = this.data.collectList[event.currentTarget.dataset.index].value_id;

        //触摸时间距离页面打开的毫秒数
        var touchTime = that.data.touch_end - that.data.touch_start;
        console.log(touchTime);
        //如果按下时间大于350为长按
        if (touchTime > 350) {
            wx.showModal({
                title: '',
                content: '确定删除吗？',
                success: function (res) {
                    if (res.confirm) {

                        util.request(api.CollectAddOrDelete, {
                            typeId: that.data.typeId,
                            valueId: goodsId
                        }, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                console.log(res.data);
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 2000
                                });
                                that.getCollectList();
                            }
                        });
                    }
                }
            })
        } else {

            wx.navigateTo({
                url: '/pages/goods/goods?id=' + goodsId,
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
