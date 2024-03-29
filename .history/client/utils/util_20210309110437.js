var api = require('../config/api.js')

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    // return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')

}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

/**
 * 封装微信request请求
 */
function request(url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                // 'X-Nideshop-Token': wx.getStorageSync('token')
                'X-shop-Token': wx.getStorageSync('token')
            },
            success: function (res) {
                console.log("success");

                if (res.statusCode == 200) {

                    if (res.data.errno == 401) {
                        //需要登录后才可以操作

                        let code = null;
                        return login().then((res) => {
                            code = res.code;
                            return getUserInfo();
                        }).then((userInfo) => {
                            //登录远程服务器
                            request(api.AuthLoginByWeixin, {code: code, userInfo: userInfo}, 'POST').then(res => {
                                if (res.errno === 0) {
                                    //存储用户信息
                                    wx.setStorageSync('userInfo', res.data.userInfo);
                                    wx.setStorageSync('token', res.data.token);

                                    resolve(res);
                                } else {
                                    reject(res);
                                }
                            }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            reject(err);
                        })
                    } else {
                        resolve(res.data);
                    }
                } else {
                    reject(res.errMsg);
                }

            },
            fail: function (err) {
                reject(err)
                console.log("failed")
            }
        })
    });
}

function get(url, data = {}) {
    return request(url, data, 'GET')
}

function post(url, data = {}) {
    return request(url, data, 'POST')
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * 调用微信登录
 */
function login() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    resolve(res.code);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

function getUserInfo() {
    return new Promise(function (resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                if (res.detail.errMsg === 'getUserInfo:ok') {
                    resolve(res);
                } else {
                    reject(res)
                }
            },
            fail: function (err) {
                reject(err);
            }
        })
    });
}

//判断页面是否需要登录
function redirect(url) {
    if (url) {
        wx.redirectTo({
            url: '/pages/auth/login/login'
        });
        return false;
    } else {
        wx.redirectTo({
            url: url
        });
    }
}

function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png'
    })
}

module.exports = {
    formatTime,
    request,
    get,
    post,
    redirect,
    showErrorToast,
    checkSession,
    login,
    getUserInfo,
}
