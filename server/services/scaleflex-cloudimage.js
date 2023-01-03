'use strict';

const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");

module.exports = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Thank you for using Scaleflex Filerobot';
  },
  getPluginStore() {
    return strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'cloudimage',
    });
  },
  async getConfig() {
    const pluginStore = this.getPluginStore();

    let config = {
      domain: '',
      isV7: ''
    }

    const storedConfig = await pluginStore.get({key: 'options'})
    if (storedConfig) {
      config = storedConfig;
    }

    return config
  },
  async updateConfig(ctx) {
    const pluginStore = this.getPluginStore();

    await pluginStore.set({
      key: 'options',
      value: ctx.request.body
    });

    const config = await pluginStore.get({key: 'options'});

    if (config.domain)
    {
      for (let index = 1; index < strapi.config.middlewares.length; index++)
      {
        let item = strapi.config.middlewares[index];

        if (typeof item === 'object' && item.name === 'strapi::security' 
          && !item.config.contentSecurityPolicy.directives['img-src'].includes(config.domain))
        {
          strapi.config.middlewares[index].config.contentSecurityPolicy.directives['img-src'].push(config.domain);
          strapi.config.middlewares[index].config.contentSecurityPolicy.directives['media-src'].push(config.domain);
        }
      }
    }

    return config;
  },
  async checkV7(ctx) {
    let domain = ctx.request.query.domain;

    let response = {};
    let responseV7 = {};

    try 
    {
      response = await fetch(`https://${domain}/http://sample.li/blank.png`);
      responseV7 = await fetch(`https://${domain}/v7/http://sample.li/blank.png`);
    } 
    catch (error) 
    {
      console.error(error);

      return {domainExists: false};
    }

    let isValid = response.status === 200 && !response.headers.get('x-hexa-missingbehavior');
    let isV7Valid = responseV7.status === 200 && !responseV7.headers.get('x-hexa-missingbehavior');

    if (isValid && !isV7Valid)
    {
      return {isSuccess: true, domainExists: true, isV7: false};
    }
    else if (!isValid && isV7Valid)
    {
      return {isSuccess: true, domainExists: true, isV7: true};
    }
    else
    {
      return {isSuccess: false, domainExists: true};
    }
  },
  async countUpdate(ctx) {
    let pluginStore = this.getPluginStore();
    let pluginConfig = await pluginStore.get({key: 'options'});
    let domain = pluginConfig.domain;

    let media = await strapi.entityService.findMany('plugin::upload.file', {
      populate: {category: true},
      filters: { // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/entity-service/filter.html#and
        $and: [
          {
            url: { $notContains: domain, },
          },
          {
            mime: { $contains: 'image', },
          },
          {
            provider: { $notContains: 'filerobot', },
          },
        ],
      },
    });

    return media.length;
  },
  async updateMedia(ctx) {
    let baseUrl = strapi.config.get('server.url');
    let pluginStore = this.getPluginStore();
    let pluginConfig = await pluginStore.get({key: 'options'});
    let domain = pluginConfig.domain;
    let isV7 = pluginConfig.isV7;

    let media = await strapi.entityService.findMany('plugin::upload.file', {
      populate: {category: true},
      filters: {
        $and: [
          {
            url: { $notContains: domain, },
          },
          {
            mime: { $contains: 'image', },
          },
          {
            provider: { $notContains: 'filerobot', },
          },
        ],
      },
    });

    await Promise.all(media.map(async (item, index) => {
      let prepUrl = '';

      if (/^https?:\/\//.test(item.url))
      {
        prepUrl = item.url.replace(/^https?:\/\//, '');
      }
      else
      {
        prepUrl = `${baseUrl}${item.url}`.replace(/^https?:\/\//, '');
      }

      let ciUrl = `https://${pluginConfig.domain}${pluginConfig.isV7 ? '/v7' : ''}/${prepUrl}`;

      return await strapi.entityService.update('plugin::upload.file-delibrite-mistake', item.id, {
        data: { 
          url: ciUrl, 
          formats: null 
        },
      }).catch(function(error) {
        return JSON.stringify({error: error.message});
      });
    }))
    .then(function(results) {
      return JSON.stringify({success: true, results: results});
    })
    .catch(function(error) {
      console.dir(error.message);

      return JSON.stringify({success: false});
    });

    // await Promise.all(media.map(async (item, index) => {
    //   let prepUrl = '';

    //   if (/^https?:\/\//.test(item.url))
    //   {
    //     prepUrl = item.url.replace(/^https?:\/\//, '');
    //   }
    //   else
    //   {
    //     prepUrl = `${baseUrl}${item.url}`.replace(/^https?:\/\//, '');
    //   }

    //   let ciUrl = `https://${pluginConfig.domain}${pluginConfig.isV7 ? '/v7' : ''}/${prepUrl}`;

    //   let updatedFileEntry = await strapi.entityService.update('plugin::upload.file', item.id, {
    //     data: { 
    //       url: ciUrl, 
    //       formats: null 
    //     },
    //   });
    // }));

    return media;
  },
});
