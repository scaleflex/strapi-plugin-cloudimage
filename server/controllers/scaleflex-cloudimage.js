'use strict';

module.exports = ({ strapi }) => ({
  async index(ctx) {
    ctx.body = await strapi
      .plugin('scaleflex-cloudimage')
      .service('scaleflexCloudimage')
      .getWelcomeMessage();
  },
  async getConfig(ctx) {
    ctx.body = await strapi
      .plugin('scaleflex-cloudimage')
      .service('scaleflexCloudimage')
      .getConfig();
  },
  async updateConfig(ctx) {
    ctx.body = await strapi
      .plugin('scaleflex-cloudimage')
      .service('scaleflexCloudimage')
      .updateConfig(ctx);
  },
  async checkV7(ctx) {
    ctx.body = await strapi
      .plugin('scaleflex-cloudimage')
      .service('scaleflexCloudimage')
      .checkV7(ctx);
  },
});
