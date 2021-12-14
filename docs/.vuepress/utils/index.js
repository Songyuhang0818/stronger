const utils = {
  genSidebar: function (title, children = [''], collapsable = true, sidebarDepth = 2) {
    var arr = new Array();
    console.log('genSidebar', { title, children, collapsable, sidebarDepth });
    arr.push({ title, children, collapsable: true, sidebarDepth })
    return arr;
  }
};

module.exports = utils;