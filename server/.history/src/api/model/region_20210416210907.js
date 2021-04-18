const _ = require("lodash");

module.exports = class extends think.Model {
    /**
     * 获取完整的省市区名称组成的字符串
     */
    async getFullRegionName(provinceId, cityId, districtId) {
        console.log("获取省市");
        const isFullRegion = await this.checkFullRegion(
            provinceId,
            cityId,
            districtId
        );
        if (!isFullRegion) {
            return "";
        }

        const regionList = await this.limit(3)
            .order({id: "asc"})
            .where({id: {in: [provinceId, cityId, districtId]}})
            .select();
        if (think.isEmpty(regionList) || regionList.length !== 3) {
            return "";
        }

        return _.flatMap(regionList, "name").join("");
    }

    /**
     * 检查省市区信息是否完整和正确
     */
    async checkFullRegion(provinceId, cityId, districtId) {
        console.log("省市信息是否完整");
        if (
            think.isEmpty(provinceId) ||
            think.isEmpty(cityId) ||
            think.isEmpty(districtId)
        ) {
            return false;
        }
        const regionList = await this.limit(3)
            .order({id: "asc"})
            .where({id: {in: [provinceId, cityId, districtId]}})
            .select();
        if (think.isEmpty(regionList) || regionList.length !== 3) {
            return false;
        }

        // 上下级关系检查
        if (
            _.get(regionList, ["0", "id"]) !== _.get(regionList, ["1", "parent_id"])
        ) {
            return false;
        }
        if (
            _.get(regionList, ["1", "id"]) !== _.get(regionList, ["2", "parent_id"])
        ) {
            return false;
        }
        return true;
    }

    /**
     * 获取区域的名称
     */
    async getRegionName(regionId) {
        return this.where({id: regionId}).getField("name", true);
    }

    /**
     * 获取下级的地区列表
     */
    async getRegionList(parentId) {
        return this.where({parent_id: parentId}).select();
    }

    /**
     * 获取区域的信息
     */
    async getRegionInfo(regionId) {
        return this.where({id: regionId}).find();
    }
};
