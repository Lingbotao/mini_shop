module.exports = class extends think.Model {
    /**
     * 获取购物车商品
     */
    async getGoodsList(userId) {
        const goodsList = await this.model("cart")
            .where({user_id: userId, session_id: 1})
            .select();
        return goodsList;
    }

    /**
     * 获取购物车选中的商品
     */
    async getCheckedGoodsList(userId) {
        const goodsList = await this.model("cart")
            .where({user_id: userId, session_id: 1, checked: 1})
            .select();
        return goodsList;
    }

    /**
     * 清空已购买商品
     */
    async clearBuyGoods(userId) {
        const $res = await this.model("cart")
            .where({user_id: userId, session_id: 1, checked: 1})
            .delete();
        return $res;
    }
};
