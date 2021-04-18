// default config
module.exports = {
    // 填写微信登录和微信支付配置
    default_module: "api",
    weixin: {
        appid: "wx1d9fc97be13c6ffe", //小程序appid
        secret: "14d2d7794dc1f4a5a5c70cf5d8da557a", // 小程序密钥
        mch_id: "", // 商户账号ID
        partner_key: "", // 微信支付密钥
        notify_url: "", // 微信异步通知
    },
};
