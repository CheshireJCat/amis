export default {
  type: 'page',
  title: '标题',
  remark: {
    title: '标题',
    body: '这是一段描述问题，注意到了没，还可以设置标题。而且只有点击了才弹出来。',
    icon: 'question-mark',
    placement: 'right',
    trigger: 'click',
    rootClose: true
  },
  body: [
    {
      type: 'form',
      debug: false,
      body: [
        {
          "type": "transfer",
          "id": "bindTransfer",
          "className": "mb-0 h-full dialog-bind-transfer-tree",
          "label": "",
          "name": "bindSelectedList",
          "selectTitle": "待选择点位",
          "resultTitle": "已选择点位",
          "checkAllLabel": false,
          "selectMode": "tree",
          "searchable": true,
          "resultListModeFollowSelect": false,
          "resultSearchable": true,
          "mode": "normal",
          "inputClassName": "h-full",
          "sortable": false,
          "menuTpl": "${keywordLabel || label}",
          "source": {
            "method": "get",
            "url": "https://yapi.baidu-int.com/mock/33791/large/points"
          },
          "searchApi": {
            "method": "get",
            "url": "https://yapi.baidu-int.com/mock/33791/large/pointsk"
          },
          "joinValues": false,
          "required": true,
          "validationErrors": {
            "isRequired": "请选择点位"
          },
          "onlyChildren": true,
          "resultSearchPlaceholder": "请输入关键字",
          "noResultsText": "暂无点位"
        },
        // {
        //   "type": "input-tree",
        //   "id": "bindTransfer",
        //   "className": "mb-0 h-full dialog-bind-transfer-tree",
        //   "label": "",
        //   "name": "bindSelectedList",
        //   "selectTitle": "待选择点位",
        //   "resultTitle": "已选择点位",
        //   "checkAllLabel": false,
        //   "selectMode": "tree",
        //   "searchable": true,
        //   "resultListModeFollowSelect": false,
        //   "resultSearchable": true,
        //   "mode": "normal",
        //   "inputClassName": "h-full",
        //   "sortable": false,
        //   "menuTpl": "${keywordLabel || label}",
        //   "source": {
        //     "method": "get",
        //     "url": "https://yapi.baidu-int.com/mock/33791/large/points"
        //   },
        //   "multiple": true,
        //   "searchApi": {
        //     "method": "get",
        //     "url": "https://yapi.baidu-int.com/mock/33791/large/pointsk"
        //   },
        //   "joinValues": false,
        //   "required": true,
        //   "validationErrors": {
        //     "isRequired": "请选择点位"
        //   },
        //   "onlyChildren": true,
        //   "resultSearchPlaceholder": "请输入关键字",
        //   "noResultsText": "暂无点位"
        // }
      ]
    }
  ],
  aside: '边栏部分',
  toolbar: '工具栏',
  initApi: '/api/mock2/page/initData'
};
