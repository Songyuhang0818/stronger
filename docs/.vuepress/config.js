const { nav, sidebar } = require("./utils/transdir2pages");
module.exports = {
  title: "宋雨航前端成长之路",
  theme: "reco",
  description: "记录前端的点点滴滴",
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  themeConfig: {
    search: true,
    searchMaxSuggestions: 10,
    nav,
    sidebar, // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    startYear: "2021", // 项目开始时间，只填写年份
  },
};
