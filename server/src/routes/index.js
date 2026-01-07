
export default [
  {
    method: 'GET',
    path: '/',
    handler: 'controller.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'controller.getConfig',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/update-config',
    handler: 'controller.updateConfig',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/is-v7',
    handler: 'controller.checkV7',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/count-update',
    handler: 'controller.countUpdate',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/update-media',
    handler: 'controller.updateMedia',
    config: {
      policies: [],
      auth: false,
    },
  },
];
