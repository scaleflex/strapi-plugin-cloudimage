/*
 *
 * HomePage
 *
 */

import React, {memo, useState, useEffect} from 'react';
import { Stack, Box, Typography, Field, FieldLabel, FieldInput, Button, Alert } from '@strapi/design-system';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {

  // const [config, setConfig] = useState(null);
  // const [loading, setLoading] = useState(true);

  const [domain, setDomain] = useState('');
  const [disabledAllButtons, setDisabledAllButtons] = useState(false);

  // useEffect(() => {
  //   request(`/${pluginId}/config`, {method: 'GET'}).then(config => {
  //     setConfig(config)
  //     setLoading(false);
  //   });
  // }, []);


  // if (loading)
  //   return (
  //     <Typography>fetching configuration...</Typography>
  //   )

  const saveConfiguration = async () => {
    setDisabledAllButtons(true);

    setDisabledAllButtons(false);
  }

  return (
    <>
      <Stack spacing={4} padding={3}>
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
