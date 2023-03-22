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

![1](https://user-images.githubusercontent.com/20809372/226889919-71a072b9-c648-4fd4-b0c4-e5c89351c302.png)

## What the plugin brings

1. This plugin simple gives client an interface to save the configuration settings.
2. It also allows clients to Cloudimage-ize all previous images:

![2](https://user-images.githubusercontent.com/20809372/226889956-a841eb93-2eaf-4608-ad86-7a4ebcc4aff5.png)

- It will NOT Cloudimage-ize images that are already hosted on Filerobot.
- It will only sync images, no videos nor audios.
