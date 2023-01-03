module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'scaleflexCloudimage.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'scaleflexCloudimage.getConfig',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/update-config',
    handler: 'scaleflexCloudimage.updateConfig',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/is-v7',
    handler: 'scaleflexCloudimage.checkV7',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/count-update',
    handler: 'scaleflexCloudimage.countUpdate',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/update-media',
    handler: 'scaleflexCloudimage.updateMedia',
    config: {
      policies: [],
      auth: false,
    },
  },
];
