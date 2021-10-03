# mini_shop

创建数据库nideshop并导入根目录下的nideshop.sql文件
(数据库字符编码为utf8mb4)

+ 项目中的数据库配置，存放在/server/src/common/config文件当中

配置为
```
module.exports = {
    handle: mysql,
    database: 'nideshop',
    prefix: 'nideshop_',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '你的密码',
    dateStrings: true
};
```

+ 安装依赖并启动
```
cd server
npm install
npm start
然后再通过微信开发者工具打开client文件区，即可运行项目
```

