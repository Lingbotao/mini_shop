const Base = require("./base.js");

module.exports = class extends Base {
    async infoAction() {
        console.log("?????????????????")
        const region = await this.model("region").getRegionInfo(
            this.get("regionId")
        );
        return this.success(region);
    }

    async listAction() {
        console.log("?????????????????")
        const regionList = await this.model("region").getRegionList(
            this.get("parentId")
        );
        return this.success(regionList);
    }
};
