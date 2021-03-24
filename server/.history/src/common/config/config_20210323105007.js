// default config
module.exports = {
    // 填写微信登录和微信支付配置
    default_module: "api",
    weixin: {
        appid: "wx1d9fc97be13c6ffe", //小程序appid
        secret: "", // 小程序密钥
        mch_id: "", // 商户账号ID
        partner_key: "", // 微信支付密钥
        notify_url: "", // 微信异步通知
    },
    express: {
        // 快递物流信息查询使用快递鸟接口
        appid: "", //对应快递鸟用户后台 用户ID
        appkey: "", // 对应快递鸟用户后台 API key
        request_url: "http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx",
    },
};
