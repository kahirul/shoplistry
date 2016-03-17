chrome.contextMenus.create({
  "title": "Find it at HappyFresh",
  "contexts": ["selection"],
  "onclick" : function(info, tab) {
    chrome.tabs.create({ url: 'popup.html?text=' + info.selectionText });
  }
});
