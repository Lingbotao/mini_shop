// pages/cart/cart.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cartGoods: [],
        cartTotal: {
            "goodsCount": 0,
            "goodsAmount": 0.00,
            "checkedGoodsCount": 0,
            "checkedGoodsAmount": 0.00
        },
        isEditCart: false,
        checkedAllStatus: true,
        editCartList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.getCartList();
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

    // 获取购物车列表
    getCartList: function () {
        let that = this;
        util.request(api.CartList).then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                that.setData({
                    cartGoods: res.data.cartList,
                    cartTotal: res.data.cartTotal
                });
            }

            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });
        });
    },

    //判断购物车商品已全选
    isCheckedAll: function () {
        //判断购物车商品已全选
        return this.data.cartGoods.every(function (element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });
    },

    // 获取已选商品信息
    checkedItem: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        let that = this;

        if (!this.data.isEditCart) {
            util.request(api.CartChecked, {
                productIds: that.data.cartGoods[itemIndex].product_id,
                isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1
            }, 'POST').then(function (res) {
                if (res.errno === 0) {
                    console.log(res.data);
                    that.setData({
                        cartGoods: res.data.cartList,
                        cartTotal: res.data.cartTotal
                    });
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
                if (index == itemIndex) {
                    element.checked = !element.checked;
                }

                return element;
            });

            that.setData({
                cartGoods: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
            });
        }
    },

    // 获取已选商品数量
    getCheckedGoodsCount: function () {
        let checkedGoodsCount = 0;
        this.data.cartGoods.forEach(function (v) {
            if (v.checked === true) {
                checkedGoodsCount += v.number;
            }
        });
        console.log(checkedGoodsCount);
        return checkedGoodsCount;
    },

    // 全选功能
    checkedAll: function () {
        let that = this;

        if (!this.data.isEditCart) {
            var productIds = this.data.cartGoods.map(function (v) {
                return v.product_id;
            });
            util.request(api.CartChecked, {
                productIds: productIds.join(','),
                isChecked: that.isCheckedAll() ? 0 : 1
            }, 'POST').then(function (res) {
                if (res.errno === 0) {
                    console.log(res.data);
                    that.setData({
                        cartGoods: res.data.cartList,
                        cartTotal: res.data.cartTotal
                    });
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let checkedAllStatus = that.isCheckedAll();
            let tmpCartData = this.data.cartGoods.map(function (v) {
                v.checked = !checkedAllStatus;
                return v;
            });

            that.setData({
                cartGoods: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
            });
        }

    },

    // 编辑购物车列表
    editCart: function () {
        var that = this;
        if (this.data.isEditCart) {
            this.getCartList();
            this.setData({
                isEditCart: !this.data.isEditCart
            });
        } else {
            //编辑状态
            let tmpCartList = this.data.cartGoods.map(function (v) {
                v.checked = false;
                return v;
            });
            this.setData({
                editCartList: this.data.cartGoods,
                cartGoods: tmpCartList,
                isEditCart: !this.data.isEditCart,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
            });
        }

    },

    // 保存修改
    updateCart: function (productId, goodsId, number, id) {
        let that = this;

        util.request(api.CartUpdate, {
            productId: productId,
            goodsId: goodsId,
            number: number,
            id: id
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                that.setData({
                    //cartGoods: res.data.cartList,
                    //cartTotal: res.data.cartTotal
                });
            }

            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });
        });

    },

    // 减一操作
    cutNumber: function (event) {

        let itemIndex = event.target.dataset.itemIndex;
        let cartItem = this.data.cartGoods[itemIndex];
        let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
        cartItem.number = number;
        this.setData({
            cartGoods: this.data.cartGoods
        });
        this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },

    // 加一操作
    addNumber: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        let cartItem = this.data.cartGoods[itemIndex];
        let number = cartItem.number + 1;
        cartItem.number = number;
        this.setData({
            cartGoods: this.data.cartGoods
        });
        this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);

    },

    // 查看商品详情
    checkoutOrder: function () {
        //获取已选择的商品
        let that = this;

        var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });

        if (checkedGoods.length <= 0) {
            return false;
        }


        wx.navigateTo({
            url: '../shopping/checkout/checkout'
        })
    },

    // 删除购物车商品
    deleteCart: function () {
        //获取已选择的商品
        let that = this;

        let productIds = this.data.cartGoods.filter(function (element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });

        if (productIds.length <= 0) {
            return false;
        }

        productIds = productIds.map(function (element, index, array) {
            if (element.checked == true) {
                return element.product_id;
            }
        });


        util.request(api.CartDelete, {
            productIds: productIds.join(',')
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                let cartList = res.data.cartList.map(v => {
                    console.log(v);
                    v.checked = false;
                    return v;
                });

                that.setData({
                    cartGoods: cartList,
                    cartTotal: res.data.cartTotal
                });
            }

            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });
        });
    }
})
