const crypto = require("crypto");
const md5 = require("md5");
const rp = require("request-promise");

module.exports = class extends think.Service {
    /**
     * 微信登录
     */
    async login(code, fullUserInfo) {
        try {
            // 获取session
            const options = {
                method: "GET",
                url: "https://api.weixin.qq.com/sns/jscode2session",
                qs: {
                    grant_type: "authorization_code",
                    js_code: code,
                    secret: think.config("weixin.secret"),
                    appid: think.config("weixin.appid"),
                },
            };

            let sessionData = await rp(options);
            sessionData = JSON.parse(sessionData);
            if (!sessionData.openid) {
                return {
                    errno: sessionData.errcode,
                    errmsg: sessionData.errmsg,
                    data: null,
                };
            }

            // 验证用户信息完整性
            const sha1 = crypto
                .createHash("sha1")
                .update(fullUserInfo.rawData.toString() + sessionData.session_key)
                .digest("hex");
            if (fullUserInfo.signature !== sha1) {
                return {errno: 400, errmsg: `signature 校验不一致`, data: null};
            }

            // 解析用户数据
            const wechatUserInfo = await this.decryptUserInfoData(
                sessionData.session_key,
                fullUserInfo.encryptedData,
                fullUserInfo.iv
            );
            return wechatUserInfo;
        } catch (err) {
            return {errno: 400, errmsg: "微信登录失败：" + e.message, data: null};
        }
    }

    /**
     * 统一下单
     */
    createUnifiedOrder(payInfo) {
        const WeiXinPay = require("werixinpay");
        const weixinpay = new WeiXinPay({
            appid: think.config("weixin.appid"), // 微信小程序appid
            openid: payInfo.openid, // 用户openid
            mch_id: think.config("weixin.mch_id"), // 商户帐号ID
            partner_key: think.config("weixin.partner_key"), // 秘钥
        });
        return new Promise((resolve, reject) => {
            weixinpay.createUnifiedOrder(
                {
                    body: payInfo.body,
                    out_trade_no: payInfo.out_trade_no,
                    total_fee: payInfo.total_fee,
                    spbill_create_ip: payInfo.spbill_create_ip,
                    notify_url: think.config("weixin.notify_url"),
                    trade_type: "JSAPI",
                },
                (res) => {
                    if (res.return_code === "SUCCESS" && res.result_code === "SUCCESS") {
                        const returnParams = {
                            appid: res.appid,
                            timeStamp: parseInt(Date.now() / 1000) + "",
                            nonceStr: res.nonce_str,
                            package: "prepay_id=" + res.prepay_id,
                            signType: "MD5",
                        };
                        const paramStr =
                            `appId=${returnParams.appid}&nonceStr=${returnParams.nonceStr}&package=${returnParams.package}&signType=${returnParams.signType}&timeStamp=${returnParams.timeStamp}&key=` +
                            think.config("weixin.partner_key");
                        returnParams.paySign = md5(paramStr).toUpperCase();
                        resolve(returnParams);
                    } else {
                        reject(res);
                    }
                }
            );
        });
    }

    /**
     * 生成排序后的支付参数query
     */
    buildQuery(queryObj) {
        const sortPayOptions = {};
        for (const key of Object.keys(queryObj).sort()) {
            sortPayOptions[key] = queryObj[key];
        }
        let payOptionQuery = "";
        for (const key of Object.keys(sortPayOptions).sort()) {
            payOptionQuery += key + "=" + sortPayOptions[key] + "&";
        }
        payOptionQuery = payOptionQuery.substring(0, payOptionQuery.length - 1);
        return payOptionQuery;
    }

    /**
     * 对query进行签名
     */
    signQuery(queryStr) {
        queryStr = queryStr + "&key=" + think.config("weixin.partner_key");
        const md5 = require("md5");
        const md5Sign = md5(queryStr);
        return md5Sign.toUpperCase();
    }

    /**
     * 处理微信支付回调
     */
    payNotify(notifyDate) {
        if (think.isEmpty(notifyDate)) {
            return false;
        }
        const notifyObj = {};
        let sign = "";
        for (const key of Object.keys(notifyDate)) {
            if (key !== "sign") {
                notifyObj[key] = notifyDate[key][0];
            } else {
                sign = notifyDate[key][0];
            }
        }
        if (
            notifyObj.return_code !== "SUCCESS" ||
            notifyObj.result_code !== "SUCCESS"
        ) {
            return false;
        }
        const signString = this.signQuery(this.buildQuery(notifyObj));
        if (think.isEmpty(sign) || signString !== sign) {
            return false;
        }
        return notifyObj;
    }
};
