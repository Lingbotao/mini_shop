module.exports = class extends think.Logic {
  loginAction() {
    this.allowMethods = "post";
    this.rules = {
      username: { require: true, string: true },
      password: { require: true, string: true },
    };
  }
};
