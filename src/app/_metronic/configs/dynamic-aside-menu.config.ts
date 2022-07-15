export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
      permissionName: "dashboard",
    },
    {
      title: 'Layout Builder',
      root: true,
      icon: 'flaticon2-expand',
      page: '/builder',
      svg: './assets/media/svg/icons/Home/Library.svg',
      permissionName: "layoutBuilder",
    },
    { section: 'Components' },
    {
      title: 'Google Material',
      root: true,
      bullet: 'dot',
      page: '/material',
      icon: 'flaticon2-browser-2',
      svg: './assets/media/svg/icons/Design/Cap-2.svg',
      permissionName: "googleMaterial",
      submenu: [
        {
          title: 'Form Controls',
          bullet: 'dot',
          page: '/material/form-controls',
          submenu: [
            {
              title: 'Auto Complete',
              page: '/material/form-controls/autocomplete',
              permission: 'accessToECommerceModule',
            },
            {
              title: 'Checkbox',
              page: '/material/form-controls/checkbox',
            },
            {
              title: 'Radio Button',
              page: '/material/form-controls/radiobutton',
            },
            {
              title: 'Datepicker',
              page: '/material/form-controls/datepicker',
            },
            {
              title: 'Form Field',
              page: '/material/form-controls/formfield',
            },
            {
              title: 'Input',
              page: '/material/form-controls/input',
            },
            {
              title: 'Select',
              page: '/material/form-controls/select',
            },
            {
              title: 'Slider',
              page: '/material/form-controls/slider',
            },
            {
              title: 'Slider Toggle',
              page: '/material/form-controls/slidertoggle',
            },
          ],
        },
        {
          title: 'Navigation',
          bullet: 'dot',
          page: '/material/navigation',
          submenu: [
            {
              title: 'Menu',
              page: '/material/navigation/menu',
            },
            {
              title: 'Sidenav',
              page: '/material/navigation/sidenav',
            },
            {
              title: 'Toolbar',
              page: '/material/navigation/toolbar',
            },
          ],
        },
        {
          title: 'Layout',
          bullet: 'dot',
          page: '/material/layout',
          submenu: [
            {
              title: 'Card',
              page: '/material/layout/card',
            },
            {
              title: 'Divider',
              page: '/material/layout/divider',
            },
            {
              title: 'Expansion panel',
              page: '/material/layout/expansion-panel',
            },
            {
              title: 'Grid list',
              page: '/material/layout/grid-list',
            },
            {
              title: 'List',
              page: '/material/layout/list',
            },
            {
              title: 'Tabs',
              page: '/material/layout/tabs',
            },
            {
              title: 'Stepper',
              page: '/material/layout/stepper',
            },
            {
              title: 'Tree',
              page: '/material/layout/tree',
            },
          ],
        },
        {
          title: 'Buttons & Indicators',
          bullet: 'dot',
          page: '/material/buttons-and-indicators',
          submenu: [
            {
              title: 'Button',
              page: '/material/buttons-and-indicators/button',
            },
            {
              title: 'Button toggle',
              page: '/material/buttons-and-indicators/button-toggle',
            },
            {
              title: 'Chips',
              page: '/material/buttons-and-indicators/chips',
            },
            {
              title: 'Icon',
              page: '/material/buttons-and-indicators/icon',
            },
            {
              title: 'Progress bar',
              page: '/material/buttons-and-indicators/progress-bar',
            },
            {
              title: 'Progress spinner',
              page: '/material/buttons-and-indicators/progress-spinner',
            },
            {
              title: 'Ripples',
              page: '/material/buttons-and-indicators/ripples',
            },
          ],
        },
        {
          title: 'Popups & Modals',
          bullet: 'dot',
          page: '/material/popups-and-modals',
          submenu: [
            {
              title: 'Bottom sheet',
              page: '/material/popups-and-modals/bottom-sheet',
            },
            {
              title: 'Dialog',
              page: '/material/popups-and-modals/dialog',
            },
            {
              title: 'Snackbar',
              page: '/material/popups-and-modals/snackbar',
            },
            {
              title: 'Tooltip',
              page: '/material/popups-and-modals/tooltip',
            },
          ],
        },
        {
          title: 'Data table',
          bullet: 'dot',
          page: '/material/data-table',
          submenu: [
            {
              title: 'Paginator',
              page: '/material/data-table/paginator',
            },
            {
              title: 'Sort header',
              page: '/material/data-table/sort-header',
            },
            {
              title: 'Table',
              page: '/material/data-table/table',
            },
          ],
        },
      ],
    },
    {
      title: 'Ng-Bootstrap',
      root: true,
      bullet: 'dot',
      page: '/ngbootstrap',
      icon: 'flaticon2-digital-marketing',
      svg: './assets/media/svg/icons/Shopping/Bitcoin.svg',
      permissionName: "ngBootstrap",
      submenu: [
        {
          title: 'Accordion',
          page: '/ngbootstrap/accordion',
        },
        {
          title: 'Alert',
          page: '/ngbootstrap/alert',
        },
        {
          title: 'Buttons',
          page: '/ngbootstrap/buttons',
        },
        {
          title: 'Carousel',
          page: '/ngbootstrap/carousel',
        },
        {
          title: 'Collapse',
          page: '/ngbootstrap/collapse',
        },
        {
          title: 'Datepicker',
          page: '/ngbootstrap/datepicker',
        },
        {
          title: 'Dropdown',
          page: '/ngbootstrap/dropdown',
        },
        {
          title: 'Modal',
          page: '/ngbootstrap/modal',
        },
        {
          title: 'Pagination',
          page: '/ngbootstrap/pagination',
        },
        {
          title: 'Popover',
          page: '/ngbootstrap/popover',
        },
        {
          title: 'Progressbar',
          page: '/ngbootstrap/progressbar',
        },
        {
          title: 'Rating',
          page: '/ngbootstrap/rating',
        },
        {
          title: 'Tabs',
          page: '/ngbootstrap/tabs',
        },
        {
          title: 'Timepicker',
          page: '/ngbootstrap/timepicker',
        },
        {
          title: 'Tooltips',
          page: '/ngbootstrap/tooltip',
        },
        {
          title: 'Typehead',
          page: '/ngbootstrap/typehead',
        },
      ],
    },
    { section: 'Applications' },
    {
      title: 'eCommerce',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      root: true,
      permission: 'accessToECommerceModule',
      page: '/ecommerce',
      permissionName: "eCommerce",
      submenu: [
        {
          title: 'Customers',
          page: '/ecommerce/customers',
        },
        {
          title: 'Products',
          page: '/ecommerce/products',
        },
      ],
    },

    //Tag Management
    { section: 'Tag Management' },
    {
      title: 'Tag Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-mail-1',
      svg: './assets/media/svg/icons/Shopping/Box1.svg',
      page: '/tag-management',
      permissionName: "tagManage",
      submenu: [
        {
          title: 'Tags',
          page: '/tag-management/tags',
        },
        {
          title: 'Templates',
          page: '/tag-management/templates',
        },
        {
          title: 'Create Tag',
          page: '/tag-management/new',
        },
      ],
    },

    //Live Traffic
    { section: 'Live Traffic' },
    {
      title: 'Live Traffic',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Layout/Layout-right-panel-2.svg',
      page: '/live-traffic',
      permissionName: "liveTraffic",
      submenu: [
        {
          title: 'View All Daily Traffic',
          page: '/live-traffic/daily-traffic',
        },
        {
          title: 'View All Queries',
          page: '/live-traffic/view-queries',
        },
        {
          title: 'Traffic By Location',
          page: '/live-traffic/grafana',
        },
      ],
    },

    //Protected Media
    { section: 'Protected Media' },
    {
      title: 'Protected Media',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Media/Airplay.svg',
      page: '/live-traffic',
      permissionName: "protectedMedia",
      submenu: [
        {
          title: 'Protected Media Report',
          page: '/protected-media',
        },
      ],
    },

    //Company Management
    { section: 'Company Management' },
    {
      title: 'Company Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Devices/Diagnostics.svg',
      page: '/company-management',
      permissionName: "companyManage",
      submenu: [
        {
          title: 'Companies',
          page: '/company-management/companies',
        },
        {
          title: 'New Company',
          page: '/company-management/new',
        },
      ],
    },

    //REPORTING
    { section: 'Reporting' },
    {
      title: 'Reporting',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Files/File.svg',
      page: '/reporting',
      permissionName: "reportManage",
      submenu: [
        {
          title: 'Perion Stats',
          page: '/reporting/perion',
        },
        {
          title: 'Apptitude Stats',
          page: '/reporting/apptitude',
        },
        {
          title: 'Hopkins Stats',
          page: '/reporting/hopkins',
        },
        {
          title: 'Media.net Stats',
          page: '/reporting/media-net',
        },
        {
          title: 'Bing Direct Stats',
          page: '/reporting/bing-direct',
        },
        {
          title: 'Lyons Stats',
          page: '/reporting/lyons',
        },
        {
          title: 'Rubi Stats',
          page: '/reporting/rubi',
        },
        {
          title: 'Verizon Direct Stats',
          page: '/reporting/verizon-direct',
        },
        {
          title: 'Third Party Sheet',
          page: '/reporting/third-party',
        },
        {
          title: 'Manual Stat Update',
          page: '/reporting/manual-stat-update',
        },
        {
          title: 'Manual Split Update',
          page: '/reporting/manual-split-update',
        },
      ],
    },

    //AUTHENTICATION
    { section: 'Authentication' },
    {
      title: 'User Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/user-management',
      permissionName: "userManage",
      submenu: [
        {
          title: 'Super Admin Manage',
          page: '/user-management/super-admin-users',
        },
        {
          title: 'Admin Manage',
          page: '/user-management/admin-users',
        },
        {
          title: 'Advertiser Manage',
          page: '/user-management/advertiser-users',
        },
        {
          title: 'Publisher Manage',
          page: '/user-management/publisher-users',
        },
        {
          title: 'Roles',
          page: '/user-management/roles',
        },
      ],
    },

    //Publisher Notifications
    { section: 'Notifications' },
    {
      title: 'Notifications',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Communication/Chat2.svg',
      page: '/notifications',
      permissionName: "notifications",
      submenu: [
        {
          title: 'Send Publisher Notifications',
          page: '/',
        },
      ],
    },

    { section: 'Custom' },
    {
      title: 'Error Pages',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Code/Warning-2.svg',
      page: '/error',
      submenu: [
        {
          title: '404 Error',
          page: '/error/404',
        },
        {
          title: '500 Error',
          page: '/error/500',
        }
      ],
    },
  ],
};
