module.exports = class extends think.Controller {
    async __before() {
        // 根据token值获取用户id
        // this.ctx.state.token = this.ctx.header['x-nideshop-token'] || '';
        this.ctx.state.token = this.ctx.header["x-shop-token"] || "";
        const TokenService = think.service("token", "api");
        this.ctx.state.userId = await TokenService.getUserId(this.ctx.state.token);

        const publicController = this.config("publicController");
        const publicAction = this.config("publicAction");
        // 如果为非公开，则验证用户是否登录
        const controllerAction = this.ctx.controller + "/" + this.ctx.action;
        if (
            !publicController.includes(this.ctx.controller) &&
            !publicAction.includes(controllerAction)
        ) {
            if (this.ctx.state.userId <= 0) {
                return this.fail(401, "请先登录");
            }
        }
    }

    /**
     * 获取时间戳
     */
    getTime() {
        return parseInt(new Date() / 1000);
    }

    /**
     * 获取当前登录用户的id
     */
    getLoginUserId() {
        return this.ctx.state.userId;
    }
};
