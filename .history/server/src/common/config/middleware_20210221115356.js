const path = require("path");
const isDev = think.env === "development";
const kcors = require("kcors");

module.exports = [
    {
        handle: kcors, //处理跨域问题
        options: {},
    },
    {
        handle: "meta",
        options: {
            logRequest: isDev,
            sendResponseTime: isDev,
        },
    },
    {
        handle: "resource",
        enable: isDev,
        options: {
            root: path.join(think.ROOT_PATH, "www"),
            publicPath: /^\/(static|favicon\.ico)/,
        },
    },
    {
        handle: "trace",
        enable: !think.isCli,
        options: {
            debug: isDev,
        },
    },
    {
        handle: "payload",
        options: {
            // keepExtensions: true,
            // limit: '5mb'
        },
    },
    {
        handle: "router",
        options: {
            defaultModule: "api",
            defaultController: "index",
            defaultAction: "index",
        },
    },
    "logic",
    "controller",
];
