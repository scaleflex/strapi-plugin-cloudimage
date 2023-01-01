'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('scaleflex-cloudimage')
      .service('myService')
      .getWelcomeMessage();
  },
});
