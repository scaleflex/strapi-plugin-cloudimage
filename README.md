# Cloudimage plugin from Scaleflex for Strapi v4

## Install

`npm install @cloudimage-strapi/content-plugin`

## Config

`config/server.js`

Append `url: 'domain (including the http/https:// part)'`

Eg: if you website is called `mywebsite.com`, then write like this:

```
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: 'https://www.mywebsite.com',
});
```

**It’s very important that you don’t forget to do this**

## Configure

![](https://user-images.githubusercontent.com/20809372/210363042-d254b19b-2cb6-493c-b3fe-676131d15cf3.png)

- You can enter either token or domain.
- Whether your Cloudimage token is v7 or not, it will be auto-detected and set.

If you enter nothing or an invalid token, you will get this error.

![](https://user-images.githubusercontent.com/20809372/210363124-a3c548f5-8bf3-4303-bad7-22906f5e1585.png)

In the rare case that we can’t auto-detect whether token is v7 or not, you will get the option to manually set it.

![](https://user-images.githubusercontent.com/20809372/210363178-0bb4c4b7-6fe6-4bee-8226-61fe0128c92f.png)

## What the plugin brings

1. This plugin simple gives client an interface to save the configuration settings.
2. It also allows clients to Cloudimage-ize all previous images:

![](https://user-images.githubusercontent.com/20809372/210363230-37094499-ecea-4f14-92e3-0a7217bb9a18.png)

- It will NOT Cloudimage-ize images that are already hosted on Filerobot.
- It will only sync images, no videos nor audios.
