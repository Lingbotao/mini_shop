// default config
module.exports = {
    // 填写微信登录和微信支付配置
    default_module: "api",
    weixin: {
        appid: "小程序appid", //小程序appid
        secret: "小程序密钥", // 小程序密钥
        mch_id: "", // 商户账号ID
        partner_key: "", // 微信支付密钥
        notify_url: "", // 微信异步通知
    },
};
