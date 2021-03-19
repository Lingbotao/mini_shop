const Base = require('./base.js');

module.exports = class extends Base {
    async indexAction() {
        const model = this.model('category');
        const data = await model.where({is_show: 1}).order(['sort_order ASC']).select();
        const topCategory = data.filter((item) => {
            return item.parent_id === 0;
        });
        const categoryList = [];
        topCategory.map((item) => {
            item.level = 1;
            categoryList.push(item);
            data.map((child) => {
                if (child.parent_id === item.id) {
                    child.level = 2;
                    categoryList.push(child);
                }
            });
        });
        return this.success(categoryList);
    }
}
