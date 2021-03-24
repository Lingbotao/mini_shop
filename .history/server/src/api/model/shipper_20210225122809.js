module.exports = class extends think.Model {
    /**
     * 根据快递公司编码获取名称
     */
    async getShipperNameByCode(shipperCode) {
        return this.where({code: shipperCode}).getField("name", true);
    }

    /**
     * 根据id获取快递公司信息
     */
    async getShipperById(shipperId) {
        return this.where({id: shipperId}).find();
    }
};
