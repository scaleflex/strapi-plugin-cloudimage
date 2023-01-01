/*
 *
 * HomePage
 *
 */

import React, {memo, useState, useEffect} from 'react';
import { Stack, Box, Typography, Field, FieldLabel, FieldInput, Button, Alert } from '@strapi/design-system';
import {request} from "@strapi/helper-plugin";
import pluginId from '../../pluginId';

const HomePage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');
  const [isV7, setIsV7] = useState(false);
  const [disabledAllButtons, setDisabledAllButtons] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    request(`/${pluginId}/config`, {method: 'GET'}).then(config => {
      setConfig(config);
      setDomain(config.domain);
      setLoading(false);
    });
  }, []);

  if (loading)
  {
    return (
      <Typography>fetching configuration...</Typography>
    );
  }

  const saveConfiguration = async () => {
    if (!domain)
    {
      return; //@Todo: better message here, ie required field
    }

    setDisabledAllButtons(true);

    // Check whether input is token or domain
    let tokenOrDomain = '';

    if (domain && domain.indexOf('.') === -1) 
    {
      tokenOrDomain = `${domain}.cloudimg.io`.trim();
    } 
    else 
    {
      tokenOrDomain = domain.trim();
    }

    // Check whether v7 or not
    let v7Check = await request(`/${pluginId}/is-v7?domain=${tokenOrDomain}`, {method: 'GET'});
    setIsV7(v7Check);

    // POST to backend to set config
    let config = {
      domain: tokenOrDomain,
      isV7: v7Check
    }

    let updatedConfigs = await request(`/${pluginId}/update-config`, {method: 'PUT', body: config});
    
    setDomain(updatedConfigs.domain);
    setSuccess(true);
    setDisabledAllButtons(false);
  }

  return (
    <>
      <Stack spacing={4} padding={3}>
        {success && isV7 && (
          <Alert title="Successfully" onClose={() => setSuccess(false)} closeLabel="Close alert" variant={'success'}>
            Configuration updated. Your domain is of Cloudimage version 7.
          </Alert>
        )}
        {success && !isV7 && (
          <Alert title="Successfully" onClose={() => setSuccess(false)} closeLabel="Close alert" variant={'success'}>
            Configuration updated. Your domain is not of Cloudimage version 7.
          </Alert>
        )}
        {error && (
          <Alert title="Failed" onClose={() => setError(false)} closeLabel="Close alert" variant={'danger'}>
            Please check your configuration setting
          </Alert>
        )}
        <Box paddingLeft={8} paddingTop={5} paddingRight={8}>
          <Typography variant={'alpha'}>Cloudimage by Scaleflex</Typography>
        </Box>
        <Field name="domain">
          <Stack spacing={1}>
            <FieldLabel>Token or Domain</FieldLabel>
            <FieldInput type="text" placeholder="Token/Domain" value={domain} onChange={(e) => {
              setDomain(e.target.value)
            }}/>
          </Stack>
        </Field>
        <Box width={200}>
          <Button disabled={disabledAllButtons} onClick={() => saveConfiguration()}>Save configuration</Button>
        </Box>
      </Stack>
    </>
  )
};

export default memo(HomePage);
