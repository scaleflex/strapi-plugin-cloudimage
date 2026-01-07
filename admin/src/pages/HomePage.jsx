import React, {useState, useEffect} from 'react';
import { Box, Typography, Field, Button, Alert, Radio, Main } from '@strapi/design-system';
import { useFetchClient } from "@strapi/strapi/admin";
import { PLUGIN_ID } from '../pluginId';

const HomePage = () => {
  const { get, put } = useFetchClient();
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
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    get(`/${PLUGIN_ID}/config`, {method: 'GET'}).then(data => {
      let config = data.data;
      setConfig(config);
      setDomain(config.domain);
      setLoading(false);

      if (!config.domain || !config.hasOwnProperty('isV7')) {
        setDisableUpdateButtons(true);
      } else {
        setDisableUpdateButtons(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <Typography>fetching configuration...</Typography>
    );
  }

  const saveConfiguration = async () => {
    if (!domain) {
      setError(true);
      setSuccess(false);
      setDisabledAllButtons(false);

      return;
    } else {
      setError(false);
    }

    setDisabledAllButtons(true);

    // Check whether input is token or domain
    let tokenOrDomain = '';

    if (domain && domain.indexOf('.') === -1) {
      tokenOrDomain = `${domain}.cloudimg.io`.trim();
    } else {
      tokenOrDomain = domain.trim();
    }

    // Check whether v7 or not
    let v7Check = await get(`/${PLUGIN_ID}/is-v7?domain=${tokenOrDomain}`);
    v7Check = v7Check.data;
    if (!v7Check.domainExists) {
      setError(true);
      setSuccess(false);
      setDisabledAllButtons(false);

      return;
    } else {
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

    let updatedConfigs = await put(`/${PLUGIN_ID}/update-config`, config);

    setDomain(updatedConfigs.data.domain);
    setSuccess(true);
    setDisabledAllButtons(false);
  }

  const countUpdate = async () => {
    setUpdateCount(-1);
    setDisabledAllButtons(true);
    let count = await get(`/${PLUGIN_ID}/count-update`);
    setUpdateCount(count.data);
    setDisabledAllButtons(false);
  }
  const updateMedia = async () => {
    setDisplayUpdateResult(false);
    setDisabledAllButtons(true);

    let result = await put(`/${PLUGIN_ID}/update-media`);
    if (result.data.response === false) {
      setUpdateMessage('Image optimization was not successful. Please try again later.');
    } else {
      setUpdateMessage(`${result.data.response} image optimizations were successful.`);
    }

    setDisplayUpdateResult(true);
    setDisabledAllButtons(false);
  }

  return (
    <Main>
      <Box background={'#FFF'} paddingLeft={8} paddingTop={5} paddingRight={8} margin={8} borderRadius={2}>
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
            There are {updateCount} image URLs to be optimized.
          </Alert>
        )}
        {displayUpdateResult && (
          <Alert onClose={() => setDisplayUpdateResult(false)} closeLabel="Close alert" variant={'success'}>
            {(updateCount <= 0) ? 'None are to be optimized.' : updateMessage}
          </Alert>
        )}
        <Box paddingTop={5} paddingRight={8}>
          <Typography variant={'alpha'}>Cloudimage by Scaleflex</Typography>
        </Box>
        <Box padding={2}>
          <Field.Root>
            <Field.Label>Token or Domain *</Field.Label>
            <Field.Input type="text" placeholder="Token/Domain" value={domain} onChange={(e) => {
              setDomain(e.target.value)
            }}/>
          </Field.Root>
        </Box>
        {!isV7CheckSuccessful && (
          <Box spacing={1}>
            <Box padding={2}>
              <Field.Root>
                <Field.Label>Is Cloudimage version 7?</Field.Label>
              </Field.Root>
              <Radio.Group onChange={e => setManualV7(e.target.value)} value={manualV7} name="manualV7">
                <Radio.Item value="true">Version 7</Radio.Item>
                <Radio.Item value="false">Not version 7</Radio.Item>
              </Radio.Group>
            </Box>
          </Box>
        )}
        <Box width={200} paddingTop={3} textAlign={"center"}>
          <Button disabled={disabledAllButtons} onClick={() => saveConfiguration()}>Save configuration</Button>
        </Box>
        <Box spacing={4} paddingTop={3} textAlign={"center"}>
          <Button margin={2} disabled={disabledAllButtons || disableUpdateButtons} onClick={() => countUpdate()}>Count optimizable images</Button>
          <Button margin={2} disabled={disabledAllButtons || disableUpdateButtons} onClick={() => updateMedia()}>Optimize old images</Button>
        </Box>
      </Box>
    </Main>
  )
};

export { HomePage };
