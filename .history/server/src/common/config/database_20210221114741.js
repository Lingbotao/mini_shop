const mysql = require("think-model-mysql");

//连接本地数据库
module.exports = {
    handle: mysql,
    database: "shop",
    prefix: "shop_",
    encoding: "utf8mb4",
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "123456",
    dateStrings: true,
};
