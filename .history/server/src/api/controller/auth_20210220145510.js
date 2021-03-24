const Base = require('./base.js')

module.exports = class extends Base{
    async loginByWeixinAction() {
        const code = this.post('code');
        const fullUserInfo = this.post('userInfo');
        const clientIp = this.ctx.ip;

        // 解释用户数据
        const {errno, errmsg, data: userInfo} = await this.service('weixin', 'api').login(code, fullUserInfo);
        if (errno !== 0) {
            return this.fail(errno, errmsg);
        }

        // 根据openid查找用户是否已经注册
        let userId = await this.model('user').where({weixin_openid: userInfo.openId}).getField('id', true);
        if (think.isEmpty(userId)) {
            // 注册
            userId = await this.model('user').add({
                username: '微信用户' + think.uuid(6), //用户名
                password: '', //密码
                register_time: parseInt(new Date().getTime() / 1000),
                register_ip: clientIp,
                mobile: '', //手机
                weixin_openid: userInfo.openId,
                avatar: userInfo.avatarUrl || '',
                gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
                nickname: userInfo.nickName
            }
        }
    }
