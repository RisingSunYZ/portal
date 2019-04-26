export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    name:'user',
    routes: [
      { path: '/user',redirect: '/user/login' },
      { path: '/user/login',  component: './Login/Login' },
      { path: '/user/forget-pw', component: './Login/ForgetPW' },
      { path: '/user/reset-pw', component: './Login/ResetPW' },
    ],
  },
  // app
  {
    path: '/',
    // component: '../layouts/BasicLayout',
    // authority: ['admin', 'user'],
    routes: [
      {
        path:"/",
        redirect:"/main/workplace",
        // authority: ['admin', 'user']
      },
      {
        path: '/form',
        name: 'custom-form',
        component: '../layouts/CommonLayout',
        routes: [
          {
            path: '/form/form-design',
            name: 'design form',
            component: './FormDesign',
          },
        ],
      },
      {
        path: '/drag',
        icon: 'table',
        name: 'drag',
        routes: [
          {
            path: '/drag/draggable',
            name: 'draggable',
            component: './List/Draggable',
          },
          {
            path: '/drag/draggable-tags',
            name: 'draggabletags',
            component: './List/DraggableTags',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/401',
            name: 'not-login',
            component: './Exception/401',
          },
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      // main
      {
        path: '/main',
        name: 'main',
        component: '../layouts/MainLayout',
        // Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/main',
            redirect: '/main/workplace',
          },
          {
            path: '/main/workplace',
            name: 'workplace',
            component: './Workplace/Workplace',
          },
          {
            path: '/main/hr-service',
            name: 'hr',
            // component: './HrService/HrService',
          },
          {
            path: '/main/infor-tech',
            name: 'IT',
            component: './InforTech/InforTech',
          },
          {
            path: '/main/fnc-service',
            name: 'financial',
            component: './FncService/FncService',
          },
          {
            path: '/main/news',
            name: 'news',
            component: './News/News',
          },
        ],
      },
      // address-book
      {
        path: '/workplace',
        name: 'work-place',
        component: '../layouts/BasicLayout',
        routes:[
          {
            path: '/workplace',
            redirect: '/workplace/address-book'
          },
          {
            path: '/workplace/address-book',
            name: 'address-book',
            component: './Workplace/AddressBook'
          },
          {
            path: '/workplace/schedule',
            name: 'schedule',
            component: './Workplace/Schedule'
          },
          // meeting-room
          {
            path: '/workplace/meeting-room/:tab',
            name: 'meeting-room',
            component: './Workplace/MeetingRoom'
          },
          {
            path: '/workplace/meeting-room/:tab/meeting-input/:meetId',
            name: 'meeting-room',
            component: './Workplace/MeetingInput'
          },
          {
            path: '/workplace/meeting-room/:tab/meeting-summary/:id',
            name: 'meeting-room',
            component: './Workplace/MeetingSummary'
          }
        ]
      },
      // news-notice
      {
        path: '/news',
        name: 'news-notice',
        component: '../layouts/BasicLayout',
        routes:[
          {
            path: '/news',
            redirect: '/news/table-list',
          },
          {
            path: '/news/table-list/:typeSn',
            name: 'table-list',
            component: './News/TableList',
          },
          {
            path: '/news/basic-list/:typeSn',
            name: 'basic-list',
            component: './News/BasicList'
          },
          {
            path: '/news/news-detail/:id',
            name: 'news-detail',
            component: './News/NewsDetail',
          }
        ]
      },
      {
        path: '/process',
        name: 'process',
        icon: 'table',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/process',
            redirect: '/main/workplace',
          },
          {
            path: '/process/list',
            name: 'process-list',
            component: './Process/List',
            routes: [
              {
                path: '/process/list',
                redirect: '/process/list/todo',
              },
              {
                path: '/process/list/todo',
                name: 'todo',
                component: './Process/Todo',
              },
              {
                path: '/process/list/already-do',
                name: 'already-do',
                component: './Process/AlreadyDo',
              },
              {
                path: '/process/list/already-send',
                name: 'already-send',
                component: './Process/AlreadySend',
              },
              {
                path: '/process/list/draft',
                name: 'draft',
                component: './Process/Draft',
              },
              {
                path: '/process/list/process-model',
                name: 'process-model',
                component: './Process/ProcessModel',
              },
              {
                path: '/process/list/process-search',
                name: 'process-search',
                component: './Process/ProcessSearch',
              },
            ],
          },
          {
            path: '/process/form',
            name: 'process-form',
            // hideInMenu: true,
            component: './Process/FormMain',
            routes: [
              {
                path: '/process/form',
                redirect: '/process/list/todo',
              },
              {
                path: '/process/form/launch/:modelId/:instId/:bizId/:taskId/:formType',
                name: 'process-launch',
                component: './Process/ProcessLaunch',
              },
              {
                path: '/process/form/view/:modelId/:instId/:bizId/:taskId/:taskType',
                name: 'form-view',
                component: './Process/ProcessView',
              },
              {
                path: '/process/form/approve/:modelId/:instId/:bizId/:taskId/:showPost',
                name: 'form-approve',
                component: './Process/ProcessApprove',
              },
            ],
          },
          {
            path: '/process/result/success/:isSubmit',
            name: 'result-success',
            component: './Process/Result/Success',
          },
          {
            path: '/process/result/fail',
            name: 'result-fail',
            component: './Process/Result/Error',
          },
        ],
      },
      {
        path: '/user-center',
        name: 'user-center',
        component: '../layouts/BasicLayout',
        routes: [
          // {
          //   path: '/user-center',
          //   redirect: '/user-center/pandect',
          // },
          // {
          //   path: '/user-center/pandect',
          //   name: 'main-workplace',
          //   // component: './UserCenter/UserPandect',
          // },
          // {
          //   path: '/user-center/baseinfo',
          //   name: 'main-workplace',
            // component: './UserCenter/Baseinfo',
          // },
          // {
          //   path: '/user-center/attendance',
          //   name: 'main-workplace',
          //   component: './UserCenter/Attendance/TabList',
          //   routes: [
          //     // {
          //     //   path: '/user-center/attendance',
          //     //   redirect: '/user-center/attendance/summary',
          //     // },
          //     {
          //       path: '/user-center/attendance/summary',
          //       name: 'attendance-summary',
          //       component: './UserCenter/Attendance/SummaryAttendance',
          //     },
          //     {
          //       path: '/user-center/attendance/record',
          //       name: 'attendance-record',
          //       component: './UserCenter/Attendance/AttendanceRecord',
          //     },
          //     {
          //       path: '/user-center/attendance/exception',
          //       name: 'attendance-exception',
          //       component: './UserCenter/Attendance/ExceptionHandle',
          //     },
          //   ],
          // },
          // {
          //   path: '/user-center/asset',
          //   name: 'main-workplace',
          //   component: './UserCenter/Assets',
          // },
          // {
          //   path: '/user-center/performance',
          //   name: 'main-workplace',
          //   component: './UserCenter/Performance',
          // },
          // {
          //   path: '/user-center/train',
          //   name: 'main-workplace',
          //   component: './UserCenter/Train',
          // },
          {
            path: '/user-center/edit',
            name: 'edit-info',
            component: './UserCenter/EditBaseInfo',
            routes: [
              {
                path: '/user-center/edit',
                redirect: '/user-center/edit/baseInfo',
              },
              {
                path: '/user-center/edit/baseInfo',
                name: 'edit-baseinfo',
                component: './UserCenter/EditBaseInfo/BaseInfo',
              },
              {
                path: '/user-center/edit/password',
                name: 'edit-password',
                component: './UserCenter/EditBaseInfo/Password',
              },
              {
                path: '/user-center/edit/mobile',
                name: 'edit-mobile',
                component: './UserCenter/EditBaseInfo/Mobile',
              },
            ],
          },
          // {
          //   path: '/user-center/salary',
          //   name: 'main-workplace',
          //   component: './UserCenter/Salary',
          // }
        ]
      },
      {
        path: '/hr-selfhelp',
        name: 'opinion',
        component: '../layouts/CommonLayout',
        routes: [
          {
            path: '/hr-selfhelp/myFeedback',
            name: 'myFeedback',
            component: './UserCenter/MyFeedback',
          },
          {
            path: '/hr-selfhelp/contact',
            name: 'contactUs',
            component: './UserCenter/ContactUs',
          },
        ],
      },
      // {
      //   path: '/user-team',
      //   name: 'user-team',
      //   component: '../layouts/CommonLayout',
      //   routes: [
      //     {
      //       path: '/user-team',
      //       redirect: '/user-team/pandect',
      //     },
      //     {
      //       path: '/user-team/pandect',
      //       name: 'user-team-pandect',
      //       component: './UserTeam/TeamPandect',
      //     },
      //     {
      //       path: '/user-team/framework',
      //       name: 'team-framework',
      //       component: './UserTeam/Framework',
      //     },
      //     {
      //       path: '/user-team/userPandectForTeam/:userNo',
      //       name: 'team-framework',
      //       component: './UserTeam/UserPandectForTeam',
      //     },
      //     {
      //       path: '/user-team/entry',
      //       name: 'annual-entry',
      //       component: './UserTeam/AnnualEntry',
      //     },
      //     {
      //       path: '/user-team/leave',
      //       name: 'annual-leave',
      //       component: './UserTeam/AnnualLeave',
      //     },
      //     {
      //       path: '/user-team/authorized',
      //       name: 'authorized-strength',
      //       component: './UserTeam/AuthorizedStrength',
      //     },
      //     {
      //       path: '/user-team/authorizedDetails',
      //       name: 'authorized-strength-details',
      //       component: './UserTeam/AuthorizedStrengthDetails',
      //     },
      //     {
      //       path: '/user-team/baseinfo',
      //       name: 'personal-info',
      //       component: './UserTeam/BaseInfo',
      //     },
      //     {
      //       path: '/user-team/asset',
      //       name: 'main-workplace',
      //       component: './UserTeam/Assets',
      //     },
      //     {
      //       path: '/user-team/attendance',
      //       name: 'main-workplace',
      //       component: './UserTeam/Attendance/TabList',
      //       routes: [
      //         {
      //           path: '/user-team/attendance',
      //           redirect: '/user-team/attendance/summary',
      //         },
      //         {
      //           path: '/user-team/attendance/summary',
      //           name: 'attendance-summary',
      //           component: './UserTeam/Attendance/SummaryAttendance',
      //         },
      //         {
      //           path: '/user-team/attendance/record',
      //           name: 'attendance-record',
      //           component: './UserTeam/Attendance/AttendanceRecord',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/user-team/attendanceChart',
      //       component: './UserTeam/Attendance/AttendanceChart',
      //     },
      //     {
      //       path: '/user-team/attendanceRateChart',
      //       component: './UserTeam/Attendance/AttendanceRateChart',
      //     },
      //     {
      //       path: '/user-team/performance',
      //       name: 'main-workplace',
      //       component: './UserTeam/Performance',
      //       routes: [
      //         {
      //           path: '/user-team/performance',
      //           redirect: '/user-team/performance/information',
      //         },
      //         {
      //           path: '/user-team/performance/information',
      //           component: './UserTeam/Performance/Information',
      //         },
      //         {
      //           path: '/user-team/performance/reward',
      //           component: './UserTeam/Performance/Reward',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/user-team/train',
      //       name: 'main-workplace',
      //       component: './UserTeam/Train',
      //     },
      //   ],
      // },
      // print
      {
        path: '/print',
        name: 'process-print',
        component: '../layouts/PrintLayout',
        routes: [
          {
            path: '/print',
            redirect: '../layouts/PrintLayout',
          },
          {
            path: '/print/form/print/:modelId/:instId/:bizId/:taskId',
            name: 'print-form',
            component: './Process/ProcessFormPrint',
          },
        ],
      },

      // file preview
      {
        path: '/file-preview',
        name: 'process',
        icon: 'table',
        component: '../layouts/LogoutLayout',
        routes: [
          {
            path: '/file-preview',
            redirect: '/file-preview/index',
          },
          {
            path: '/file-preview/index',
            name: 'process-list',
            component: './FilePreview/FilePreview',
          }]
      }
    ],
  },
  {
    component: '404',
  },
]


