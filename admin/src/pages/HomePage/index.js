/*
 *
 * HomePage
 *
 */

import React, {memo, useState, useEffect} from 'react';
import { Stack, Box, Typography, Field, FieldLabel, FieldInput, Button, Alert, Radio, RadioGroup } from '@strapi/design-system';
import {request} from "@strapi/helper-plugin";
import pluginId from '../../pluginId';

const HomePage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');
  const [isV7, setIsV7] = useState(false);
  const [isV7CheckSuccessful, setIsV7CheckSuccessful] = useState(true);
  const [manualV7, setManualV7] = useState(false);
  const [disabledAllButtons, setDisabledAllButtons] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [disableUpdateButtons, setDisableUpdateButtons] = useState(false);
  const [updateCount, setUpdateCount] = useState(-1);
  const [displayUpdateResult, setDisplayUpdateResult] = useState(false);

  useEffect(() => {
    request(`/${pluginId}/config`, {method: 'GET'}).then(config => {
      setConfig(config);
      setDomain(config.domain);
      setLoading(false);

      if (!config.domain || !config.hasOwnProperty('isV7'))
      {
        setDisableUpdateButtons(true);
      }
      else
      {
        setDisableUpdateButtons(false);
      }
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
      setError(true);
      setSuccess(false);
      setDisabledAllButtons(false);

      return;
    }
    else
    {
      setError(false);
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

    if (!v7Check.domainExists)
    {
      setError(true);
      setSuccess(false);
      setDisabledAllButtons(false);

      return;
    }
    else
    {
      setError(false);
    }

    setIsV7CheckSuccessful(v7Check.isSuccess);

    let isV7Overall = v7Check.isSuccess ? v7Check.isV7 : manualV7;
    setIsV7(isV7Overall);

    // POST to backend to set config
    let config = {
      domain: tokenOrDomain,
      isV7: isV7Overall
    }

    let updatedConfigs = await request(`/${pluginId}/update-config`, {method: 'PUT', body: config});
    
    setDomain(updatedConfigs.domain);
    setSuccess(true);
    setDisabledAllButtons(false);
  }

  const countUpdate = async () => {
    setUpdateCount(-1);
    setDisabledAllButtons(true);
    let count = await request(`/${pluginId}/count-update`, {method: 'GET'});
    setUpdateCount(count);
    setDisabledAllButtons(false);
  }
  const updateMedia = async () => {
    setDisplayUpdateResult(false);
    setDisabledAllButtons(true);
    let result = await request(`/${pluginId}/update-media`, {method: 'PUT'});
    console.dir(result);
    setDisplayUpdateResult(true);
    setDisabledAllButtons(false);
  }

  return (
    <>
      <Stack spacing={4} padding={3}>
        {success && isV7CheckSuccessful && (
          <Alert title="Successful" onClose={() => setSuccess(false)} closeLabel="Close alert" variant={'success'}>
            Configuration updated. Your domain is {isV7 ? '' : 'not'} of Cloudimage version 7.
          </Alert>
        )}
        {success && !isV7CheckSuccessful && (
          <Alert title="Failed" onClose={() => setError(false)} closeLabel="Close alert" variant={'danger'}>
            Cannot auto-determine whether it's Cloudimage version 7 or not. Please mannually set Cloudimage version.
          </Alert>
        )}
        {error && (
          <Alert title="Failed" onClose={() => setError(false)} closeLabel="Close alert" variant={'danger'}>
            Please check your configuration inputs. Ensure you entered valid inputs for all required fields.
          </Alert>
        )}
        {updateCount > -1 && (
          <Alert onClose={() => setUpdateCount(-1)} closeLabel="Close alert" variant={'success'}>
            There are {updateCount} image URLs to be updated.
          </Alert>
        )}
        {displayUpdateResult && (
          <Alert onClose={() => setDisplayUpdateResult(false)} closeLabel="Close alert" variant={'success'}>
            {(updateCount <= 0) ? 'None are to be updated.' : 'The image URLs have been updated.'}
          </Alert>
        )}
        <Box paddingLeft={8} paddingTop={5} paddingRight={8}>
          <Typography variant={'alpha'}>Cloudimage by Scaleflex</Typography>
        </Box>
        <Field name="domain">
          <Stack spacing={1}>
            <FieldLabel>Token or Domain *</FieldLabel>
            <FieldInput type="text" placeholder="Token/Domain" value={domain} onChange={(e) => {
              setDomain(e.target.value)
            }}/>
          </Stack>
        </Field>
        {!isV7CheckSuccessful && (
          <Stack spacing={1}>
            <FieldLabel>Is Cloudimage version 7 ?</FieldLabel>
            <RadioGroup onChange={e => setManualV7(e.target.value)} value={manualV7} name="manualV7">
              <Radio value="true">Version 7</Radio>
              <Radio value="false">Not version 7</Radio>
            </RadioGroup>
          </Stack>
        )}
        <Box width={200}>
          <Button disabled={disabledAllButtons} onClick={() => saveConfiguration()}>Save configuration</Button>
        </Box>
        <Stack horizontal spacing={4}>
          <Button disabled={disabledAllButtons || disableUpdateButtons} onClick={() => countUpdate()}>Count updatable images</Button>
          <Button disabled={disabledAllButtons || disableUpdateButtons} onClick={() => updateMedia()}>Update old images</Button>
        </Stack>
      </Stack>
    </>
  )
};

export default memo(HomePage);
