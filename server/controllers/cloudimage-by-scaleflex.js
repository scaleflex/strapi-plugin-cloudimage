'use strict';

module.exports = ({ strapi }) => ({
  async index(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('scaleflexCloudimage')
      .getWelcomeMessage();
  },
  async getConfig(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('scaleflexCloudimage')
      .getConfig();
  },
  async updateConfig(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('scaleflexCloudimage')
      .updateConfig(ctx);
  },
  async checkV7(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('scaleflexCloudimage')
      .checkV7(ctx);
  },
  async countUpdate(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('scaleflexCloudimage')
      .countUpdate(ctx);
  },
  async updateMedia(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('scaleflexCloudimage')
      .updateMedia(ctx);
  },
});
