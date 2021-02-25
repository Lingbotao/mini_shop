module.exports = class extends think.Model {
  /**
   * 获取分类列表
   */
  async getChildCategoryId(parentId) {
    const childIds = await this.where({ parent_id: parentId }).getField(
      "id",
      10000
    );
    return childIds;
  }

  async getCategoryWhereIn(categoryId) {
    const childIds = await this.getChildCategoryId(categoryId);
    childIds.push(categoryId);
    return childIds;
  }
};
