// pages/shopping/checkout/checkout.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkedGoodsList: [],
        checkedAddress: {},
        checkedCoupon: [],
        couponList: [],
        goodsTotalPrice: 0.00, //商品总价
        freightPrice: 0.00,    //快递费
        couponPrice: 0.00,     //优惠券的价格
        orderTotalPrice: 0.00,  //订单总价
        actualPrice: 0.00,     //实际需要支付的总价
        addressId: 0,
        couponId: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId) {
                this.setData({
                    'addressId': addressId
                });
            }

            var couponId = wx.getStorageSync('couponId');
            if (couponId) {
                this.setData({
                    'couponId': couponId
                });
            }
        } catch (e) {
            // Do something when catch error
        }
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
        // 页面显示
        wx.showLoading({
            title: '加载中...',
        })
        this.getCheckoutInfo();
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
    getCheckoutInfo: function () {
        let that = this;
        util.request(api.CartCheckout, {
            addressId: that.data.addressId,
            couponId: that.data.couponId
        }).then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                that.setData({
                    checkedGoodsList: res.data.checkedGoodsList,
                    checkedAddress: res.data.checkedAddress,
                    actualPrice: res.data.actualPrice,
                    checkedCoupon: res.data.checkedCoupon,
                    couponList: res.data.couponList,
                    couponPrice: res.data.couponPrice,
                    freightPrice: res.data.freightPrice,
                    goodsTotalPrice: res.data.goodsTotalPrice,
                    orderTotalPrice: res.data.orderTotalPrice
                });
            }
            wx.hideLoading();
        });
    },
    selectAddress() {
        wx.navigateTo({
            url: '/pages/shopping/address/address',
        })
    },
    addAddress() {
        wx.navigateTo({
            url: '/pages/shopping/addressAdd/addressAdd',
        })
    },

    submitOrder: function () {
        if (this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        util.request(api.OrderSubmit, {
            addressId: this.data.addressId,
            couponId: this.data.couponId
        }, 'POST').then(res => {
            if (res.errno === 0) {
                const orderId = res.data.orderInfo.id;
                pay.payOrder(parseInt(orderId)).then(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                    });
                }).catch(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                    });
                });
            } else {
                util.showErrorToast('下单失败');
            }
        });
    }
})
