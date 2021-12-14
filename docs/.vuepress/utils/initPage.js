const fs = require('fs');
// 排除检查的文件
var excludes = ['.DS_Store']

var fileHelper = {
  getFileName: function (filePath) {
    console.log('getFileName filePath', filePath);
    let filenames = [];
    let fileTypes = /\.md$/; //只匹配以md结尾的文件
    const fileList = fs.readdirSync(filePath)
    console.log('getFileName fileList', fileList);

    fileList.forEach(file => {
      if (excludes.indexOf(file) < 0) {
        const fullPath = `${filePath}/${file}`;
        var fileInfo = fs.statSync(fullPath)
        if (fileInfo.isFile()) {
          if (fileTypes.test(file) > 0) {
            if (file === 'index.md') {
              file = '';
            } else {
              file = file.replace('.md', '');
            }
            filenames.push(`${file}`);
          }
        }
      }
    })
    filenames.sort(); // 排序
    console.log('getFileName filenames', filenames);
    return filenames;
  }
}
module.exports = fileHelper;