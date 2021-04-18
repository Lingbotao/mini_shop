module.exports = class extends think.Model {
    async addFootprint(userId, goodsId) {
        console.log("用户足迹")
        // 用户已登录才可以添加足迹
        if (userId > 0 && goodsId > 0) {
            await this.add({
                goods_id: goodsId,
                user_id: userId,
                add_time: parseInt(Date.now() / 1000),
            });
        }
    }
};
