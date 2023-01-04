'use strict';

module.exports = ({ strapi }) => {
  strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'cloudimage',
  })
  .get({key: 'options'})
  .then((config) => {
    if (config && config.hasOwnProperty('domain') && config.domain)
    {
      for (let index = 1; index < strapi.config.middlewares.length; index++)
      {
        let item = strapi.config.middlewares[index];

        if (typeof item === 'object' && item.name === 'strapi::security' && !item.config.contentSecurityPolicy.directives['img-src'].includes(config.domain))
        {
          strapi.config.middlewares[index].config.contentSecurityPolicy.directives['img-src'].push(config.domain);
          strapi.config.middlewares[index].config.contentSecurityPolicy.directives['media-src'].push(config.domain);
        }
      }
    }
  });
};
