'use strict';

module.exports = ({ strapi }) => {
  const pluginMiddleware = {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'scaleflex.cloudimg.io', 'assets.scaleflex.com', '*.cloudimg.io'],
          'media-src': ["'self'", 'data:', 'blob:', 'scaleflex.cloudimg.io', 'assets.scaleflex.com', '*.cloudimg.io'],
          upgradeInsecureRequests: null,
        },
      },
    },
  };

  // Merge a `source` object to a `target` recursively
  const merge = (target, source) => {
    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (const key of Object.keys(source))
    {
      if (Array.isArray(source[key]))
      {
        Object.assign(source[key], [...new Set(target[key].concat(source[key]))]);
      }

      if (source[key] instanceof Object && !Array.isArray(source[key]))
      {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }

    // Join `target` and modified `source`
    Object.assign(target || {}, source);

    return target;
  };

  for (let index = 1; index < strapi.config.middlewares.length; index++)
  {
    let item = strapi.config.middlewares[index];

    if (typeof item === 'object' && item.name === 'strapi::security')
    {
      let mergedSettings = merge(item.config, pluginMiddleware.config);
      strapi.config.middlewares.splice(index, 1, {name: 'strapi::security', config: mergedSettings});

      break;
    }
    else if (typeof item === 'string' && item === 'strapi::security')
    {
      strapi.config.middlewares.splice(index, 1, pluginMiddleware);

      break;
    }
    else
    {
      strapi.config.middlewares.push(pluginMiddleware);

      break;
    }
  }
};
