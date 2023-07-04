import { Tooltip } from '@magickml/client-core';
import { pluginManager } from '@magickml/core';
import { Clear } from '@mui/icons-material/';
import { IconButton, Input, Button } from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import styles from './styles.module.scss';

const SettingsWindowChild = ({
  displayName,
  keyName,
  getUrl,
  setKey,
  getKey,
}) => {
  const [clear, setClear] = useState('Clear');
 

  return (
    <div className={styles['child']}>
      <p className={styles['title']}>{displayName}</p>

      <Input
        className={styles['input']}
        type="password"
        placeholder="Paste Your API Key"
        id={keyName}
        name={keyName}
        value={getKey(keyName) || ''}
        onChange={(e) => {
          setKey(keyName, e.target.value);
        }}
      />
      {getKey(keyName) && getKey(keyName) !== '' && (
        <>
          <Tooltip title={clear}>
            <IconButton
              className={styles['icon']}
              onClick={() => {
                setKey(keyName, '');
                setClear('Cleared');
                setTimeout(() => {
                  setClear('Clear');
                }, 1000);
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </>
      )}

      <div className={styles['info']}>
        Your API key is{' '}
        <a href={getUrl} target="_blank" rel="noreferrer" tabIndex={-1}>
          available here.
        </a>
      </div>
    </div>
  );
};

const SettingsWindow = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State for keeping track of secret key values
  const [secretKeys, setSecretKeys] = useState(() => {
    const secrets = window.localStorage.getItem('secrets');
    return secrets ? JSON.parse(secrets) : {};
  });

  // Function to get service key from local storage
  const getKey = (key) => {
    return secretKeys[key] || '';
  };

  // Function to update secret key in state
  const setKey = (newKey, newValue) => {
    setSecretKeys((prevSecretKeys) => ({
      ...prevSecretKeys,
      [newKey]: newValue,
    }));
  };

  const handleSaveKey = () => {
    // Perform validation on the secretKeys object
    const hasValue = Object.values(secretKeys).some((value) => value !== '');

    if (!hasValue) {
      // Show an error message if no setting has a value
      enqueueSnackbar('Please fill in at least one setting', {
        variant: 'error',
      });
      return;
    }

    localStorage.setItem('secrets', JSON.stringify(secretKeys));

    pluginManager.getSecrets(true).forEach((value) => {
      const { name, displayName }:any = value;
      const secretName = displayName || name;
      const valueName = secretKeys[value.key];

      if (valueName) {
        enqueueSnackbar(`${secretName.toLowerCase()} set successfully`, {
          variant: 'success',
        });
      }
    });
  };

  const globalSecrets = pluginManager.getSecrets(true);

  return (
    <>
      <div className={styles['settings-editor']}>
        {globalSecrets.map((value) => {
          return (
            <SettingsWindowChild
              key={value.key}
              displayName={value.name}
              keyName={value.key}
              getUrl={value.getUrl}
              setKey={setKey}
              getKey={getKey}
            />
          );
        })}
        <div className={styles['child']}>
          <p>
            We do not keep your API keys. They are stored in your browser's
            local storage.
          </p>
        </div>
        <div>
          <Button
            onClick={handleSaveKey}
            className={styles.btn}
            variant="outlined"
            style={{ marginLeft: '1rem' }}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default SettingsWindow;
