// pages/search/search.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        keywrod: '',
        searchStatus: false,
        goodsList: [],
        helpKeyword: [],
        historyKeyword: [],
        categoryFilter: false,
        currentSortType: 'default',
        currentSortOrder: '',
        filterCategory: [],
        defaultKeyword: {},
        hotKeyword: [],
        page: 1,
        size: 20,
        currentSortType: 'id',
        currentSortOrder: 'desc',
        categoryId: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSearchKeyword();
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

    closeSearch: function () {
        wx.navigateBack()
    },
    clearKeyword: function () {
        this.setData({
            keyword: '',
            searchStatus: false
        });
    },
    getSearchKeyword() {
        let that = this;
        util.request(api.SearchIndex).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    historyKeyword: res.data.historyKeywordList,
                    defaultKeyword: res.data.defaultKeyword,
                    hotKeyword: res.data.hotKeywordList
                });
            }
        });
    },

    inputChange: function (e) {

        this.setData({
            keyword: e.detail.value,
            searchStatus: false
        });
        this.getHelpKeyword();
    },
    getHelpKeyword: function () {
        let that = this;
        util.request(api.SearchHelper, {keyword: that.data.keyword}).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    helpKeyword: res.data
                });
            }
        });
    },
    inputFocus: function () {
        this.setData({
            searchStatus: false,
            goodsList: []
        });

        if (this.data.keyword) {
            this.getHelpKeyword();
        }
    },
    clearHistory: function () {
        this.setData({
            historyKeyword: []
        })

        util.request(api.SearchClearHistory, {}, 'POST')
            .then(function (res) {
                console.log('清除成功');
            });
    },
    getGoodsList: function () {
        let that = this;
        util.request(api.GoodsList, {
            keyword: that.data.keyword,
            page: that.data.page,
            size: that.data.size,
            sort: that.data.currentSortType,
            order: that.data.currentSortOrder,
            categoryId: that.data.categoryId
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    searchStatus: true,
                    categoryFilter: false,
                    goodsList: res.data.data,
                    filterCategory: res.data.filterCategory,
                    page: res.data.currentPage,
                    size: res.data.numsPerPage
                });
            }

            //重新获取关键词
            that.getSearchKeyword();
        });
    },
    onKeywordTap: function (event) {

        this.getSearchResult(event.target.dataset.keyword);

    },
    getSearchResult(keyword) {
        this.setData({
            keyword: keyword,
            page: 1,
            categoryId: 0,
            goodsList: []
        });

        this.getGoodsList();
    },
    openSortFilter: function (event) {
        let currentId = event.currentTarget.id;
        switch (currentId) {
            case 'categoryFilter':
                this.setData({
                    'categoryFilter': !this.data.categoryFilter,
                    'currentSortOrder': 'asc'
                });
                break;
            case 'priceSort':
                let tmpSortOrder = 'asc';
                if (this.data.currentSortOrder == 'asc') {
                    tmpSortOrder = 'desc';
                }
                this.setData({
                    'currentSortType': 'price',
                    'currentSortOrder': tmpSortOrder,
                    'categoryFilter': false
                });

                this.getGoodsList();
                break;
            default:
                //综合排序
                this.setData({
                    'currentSortType': 'default',
                    'currentSortOrder': 'desc',
                    'categoryFilter': false
                });
                this.getGoodsList();
        }
    },
    selectCategory: function (event) {
        let currentIndex = event.target.dataset.categoryIndex;
        let filterCategory = this.data.filterCategory;
        let currentCategory = null;
        for (let key in filterCategory) {
            if (key == currentIndex) {
                filterCategory[key].selected = true;
                currentCategory = filterCategory[key];
            } else {
                filterCategory[key].selected = false;
            }
        }
        this.setData({
            'filterCategory': filterCategory,
            'categoryFilter': false,
            categoryId: currentCategory.id,
            page: 1,
            goodsList: []
        });
        this.getGoodsList();
    },
    onKeywordConfirm(event) {
        this.getSearchResult(event.detail.value);
    }
})
