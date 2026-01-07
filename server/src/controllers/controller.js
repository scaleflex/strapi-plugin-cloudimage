const controller = ({ strapi }) => ({
  async index(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('service')
      .getWelcomeMessage();
  },
  async getConfig(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('service')
      .getConfig();
  },
  async updateConfig(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('service')
      .updateConfig(ctx);
  },
  async checkV7(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('service')
      .checkV7(ctx);
  },
  async countUpdate(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('service')
      .countUpdate(ctx);
  },
  async updateMedia(ctx) {
    ctx.body = await strapi
      .plugin('cloudimage-by-scaleflex')
      .service('service')
      .updateMedia(ctx);
  },
});

export default controller;
