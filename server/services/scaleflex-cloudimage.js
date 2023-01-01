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

    return config;
  },
  async checkV7(ctx) {
    let domain = ctx.request.query.domain;

    let response = await fetch(`https://${domain}/http://sample.li/blank.png`);
    let responseV7 = await fetch(`https://${domain}/v7/http://sample.li/blank.png`);

    let isValid = response.status === 200 && !response.headers.get('x-hexa-missingbehavior');
    let isV7Valid = responseV7.status === 200 && !responseV7.headers.get('x-hexa-missingbehavior');

    if (isValid && !isV7Valid)
    {
      return false;
    }
    else if (!isValid && isV7Valid)
    {
      return true;
    }
    else
    {
      // Token error (eg: entered wrong token)
      return false; // @Todo: Do this properly later
    }
  },
});
