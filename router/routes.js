define(function () {
   var routes = [
       {
           path: 'public',
           name: 'public',
           children: [
               {
                   path: 'index',
                   name: 'index',
                   component: 'view/base/layouts/index',
               }
           ]
       },
       {
           path: 'basic',
           name: 'basic',
           children: [
               {
                   path: 'icon',
                   name: 'icon',
                   component: 'view/base/basic/icon',
               },
               {
                   path: 'button',
                   name: 'button',
                   component: 'view/base/basic/button',
               }
           ],
           
       },
       {
           path: 'forms',
           name: 'forms',
           children: [
               {
                   path: 'input',
                   name: 'input',
                   component: 'view/forms/input',
               },
               {
                   path: 'select',
                   name: 'select',
                   component: 'view/forms/select',
               },
               {
                   path: 'form',
                   name: 'form',
                   component: 'view/forms/form',
               },
               {
                   path: 'datapick',
                   name: 'datapick',
                   component: 'view/forms/datapick',
               },
           ]
       },
       {
           path: 'table',
           name: 'table',
           children: [
               {
                   path: 'simple',
                   name: 'simple',
                   component: 'view/table/simple',
               },
               {
                   path: 'data',
                   name: 'data',
                   component: 'view/table/data',
               },
               {
                   path: 'pagination',
                   name: 'pagination',
                   component: 'view/table/pagination',
               },
           ]
       },
       {
           path: 'navigation',
           name: 'navigation',
           children: [
               {
                   path: 'navmenu',
                   name: 'navmenu',
                   component: 'view/navigation/navmenu',
               },
               {
                   path: 'tabs',
                   name: 'tabs',
                   component: 'view/navigation/tabs',
               },
               {
                   path: 'scrollbar',
                   name: 'scrollbar',
                   component: 'view/navigation/scrollbar',
               },
           ]
       },
       {
           path: 'notice',
           name: 'notice',
           children: [
               {
                   path: 'alert',
                   name: 'alert',
                   component: 'view/notice/alert',
               },
               {
                   path: 'dialog',
                   name: 'dialog',
                   component: 'view/notice/dialog',
               },
               {
                   path: 'loading',
                   name: 'loading',
                   component: 'view/notice/loading',
               },
               {
                   path: 'message',
                   name: 'message',
                   component: 'view/notice/message',
               },
               {
                   path: 'popover',
                   name: 'popover',
                   component: 'view/notice/popover',
               },
               {
                   path: 'tooltip',
                   name: 'tooltip',
                   component: 'view/notice/tooltip',
               },
               {
                   path: 'layer',
                   name: 'layer',
                   component: 'view/notice/layer',
               },
           ]
       },
       {
           path: 'navigation',
           name: 'navigation',
           children: [
               {
                   path: 'navmenu',
                   name: 'navmenu',
                   component: 'view/navigation/navmenu',
               },
               {
                   path: 'tabs',
                   name: 'tabs',
                   component: 'view/navigation/tabs',
               },
               {
                   path: 'scrollbar',
                   name: 'scrollbar',
                   component: 'view/navigation/scrollbar',
               }
           ],
           
       },
   ]
   return routes;
});