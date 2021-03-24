// pages/ucenter/index/index.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        showLoginDialog: false,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userinfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            app.userInfoReadyCall = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                })
            }
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
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

    // 判断用户是否已登录
    onUserInfoClick: function () {
        if (wx.getStorageSync('token')) {
        } else {
            this.showLoginDialog();
        }
    },

    // 登录操作
    showLoginDialog() {
        this.setData({
            showLoginDialog: true
        })
    },

    // 取消登录操作
    onCloseLoginDialog() {
        this.setData({
            showLoginDialog: false
        })
    },

    onDialogBody() {
        // 阻止冒泡
    },

    // 微信登录
    onWechatLogin(e) {
        if (e.detail.errMsg !== 'getUserInfo:ok') {
            if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
                return false
            }
            wx.showToast({
                title: '微信登录失败',
            })
            return false
        }
        util.login().then((res) => {
            return util.request(api.AuthLoginByWeixin, {
                code: res,
                userInfo: e.detail
            }, 'POST');
        }).then((res) => {
            console.log(res)
            if (res.errno !== 0) {
                wx.showToast({
                    title: '微信登录失败',
                })
                return false;
            }
            // 设置用户信息
            this.setData({
                userInfo: res.data.userInfo,
                showLoginDialog: false
            });
            app.globalData.userInfo = res.data.userInfo;
            app.globalData.token = res.data.token;
            wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
            wx.setStorageSync('token', res.data.token);
        }).catch((err) => {
            console.log(err)
        })
    },

    // 登录后跳转的页面
    onOrderInfoClick: function (event) {
        wx.navigateTo({
            url: '/pages/ucenter/order/order',
        })
    },

    onSectionItemClick: function (event) {

    },

    // 跳转到个人信息页面
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })
    },
    getUserInfo(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
        })
    }
})
