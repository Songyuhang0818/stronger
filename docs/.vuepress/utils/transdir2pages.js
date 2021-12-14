const path = require('path');
const fs = require('fs');
const resolvePath = (dir) => path.resolve(__dirname, dir);
const dir = resolvePath('../../pages');
// nav数组
const nav = [];
// 侧边栏
const sidebar = {};

// 生成导航
function generateNav() {
  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const pathMatcher = fullPath.match(/pages[/\\](\d+_(.*))/);
      const _path = pathMatcher && pathMatcher[1];
      const text = pathMatcher && pathMatcher[2];

      const files = fs.readdirSync(fullPath);
      // 默认拿第一个作为默认跳转
      if (files && files.length > 0) {
        // 排除mac的DS_Store文件
        const suffix =
          files[0].toLocaleLowerCase() === 'readme.md' || files[0].toLocaleLowerCase() === '.ds_store'
            ? ''
            : `${files[0].slice(0, -3)}/`;
        const link = `/pages/${_path}/${suffix}`;
        const encodeLink = `/pages/${encodeURIComponent(_path)}/${suffix}`;
        sidebar[link] = recurseDir(fullPath);
        nav.push({ text, link: encodeLink });
      }
    }
  });
}

// 递归文件夹
function recurseDir(dir, pages = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    // 排除mac的DS_Store文件
    if (item.indexOf('.DS_Store') > -1) {
      return;
    }

    // const fullPath = path.join(dir, item);

    // 找到并识别为一个页面
    if (/\.md$/i.test(item)) {
      const name =
        item.toLocaleLowerCase() === 'readme.md' ? '' : item.slice(0, -3);
      pages.push(name);
    }

    // const stat = fs.statSync(fullPath);
    // if (stat.isDirectory()) {
    //   const routePathMatcher = dir.replace(/\\/g, '/').match(/pages\/.*/);
    //   if (routePathMatcher && routePathMatcher[0]) {
    //     pages.push({
    //       title: item,
    //       path: `/${routePathMatcher[0]}/${item}/`,
    //       collapsable: true,
    //       sidebarDepth: 2,
    //       children: [],
    //     });
    //   }
    //   recurseDir(fullPath, pages[pages.length - 1].children); //递归读取文件
    // }
  });
  return pages;
}

generateNav();

module.exports = { nav, sidebar };
