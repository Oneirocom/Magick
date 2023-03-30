// GENERATED 
import { IconBtn, Switch } from '@magickml/client-core';
import { IGNORE_AUTH, pluginManager } from '@magickml/engine';
import { Close, Done, Edit } from '@mui/icons-material';
import { Avatar, Button, Input, Typography } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useConfig } from '../../../contexts/ConfigProvider';
import AgentPubVariables from './AgentPubVariables';
import styles from './index.module.scss';
import validateSpellData from './spellValidator';

/** The RenderComp component renders the given element with the provided properties. */
const RenderComp = (props) => {
  return <props.element props={props} />;
};

/**
 * The AgentDetails component displays detailed information about the selected agent.
 */
const AgentDetails = ({
  selectedAgentData,
  setSelectedAgentData,
  updateCallback,
  onLoadEnables,
}) => {
  const [spellList, setSpellList] = useState<any[]>([]);
  const config = useConfig();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [oldName, setOldName] = useState<string>('');
  const [enable, setEnable] = useState(onLoadEnables);
  const globalConfig = useSelector((state: any) => state.globalConfig);
  const token = globalConfig?.token;
  const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` };

  /**
   * Send an HTTP PATCH request to update the agent.
   * @param {string} id - Agent ID.
   * @param {object} data - Updated agent data.
   */
  const update = (id, data = undefined) => {
    const _data = data || { ...selectedAgentData };
    id = id || _data.id;
    if (_data['id']) {
      delete _data.id;
      delete _data?.dirty;
    }

    _data.spells = Array.isArray(_data?.spells)
      ? JSON.stringify(_data.spells)
      : '[]';
    _data.enabled = _data.enabled ? true : false;
    _data.updatedAt = new Date().toISOString();
    axios
      .patch(`${config.apiUrl}/agents/${id}`, _data, { headers })
      .then((res) => {
        if (typeof res.data === 'string' && res.data === 'internal error') {
          enqueueSnackbar('Internal error updating agent', {
            variant: 'error',
          });
        } else {
          enqueueSnackbar('Updated agent', {
            variant: 'success',
          });
          setSelectedAgentData(res.data);
          updateCallback();
        }
      })
      .catch((e) => {
        console.error('ERROR', e);
        enqueueSnackbar('internal error updating entity', {
          variant: 'error',
        });
      });
  };

  /**
   * Export agent data to a JSON file, removing any sensitive information.
   */
  const exportAgent = () => {
    const fileName = 'agent';

    const exportAgentData = { ...selectedAgentData };

    exportAgentData.secrets = {};

    Object.keys(exportAgentData.data).forEach((key) => {
      if (
        key.includes('api') ||
        key.includes('token') ||
        key.includes('secret')
      ) {
        delete exportAgentData.data[key];
        console.log('deleted key', key);
      }
    });

    const json = JSON.stringify(exportAgentData);

    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.agent.json`);
    document.body.appendChild(link);
    link.click();

    if (!link.parentNode) return;
    link.parentNode.removeChild(link);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${config.apiUrl}/spells?projectId=${config.projectId}`,
        { headers }
      );
      const json = await res.json();

      setSpellList(json.data);
    })();
  }, []);

  return (
    <div style={{ overflowY: 'scroll', height: '100vh' }}>
      <div className={`${styles.agentDetailsContainer}`}>
        {editMode ? (
          <div className={styles.agentDescription}>
            <input
              type="text"
              name="name"
              value={selectedAgentData.name}
              onChange={(e) =>
                setSelectedAgentData({
                  ...selectedAgentData,
                  name: e.target.value,
                })
              }
              placeholder="Add new agent name here"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  update(selectedAgentData.id);
                }
              }}
            />
            <IconBtn
              label={'Done'}
              Icon={<Done />}
              onClick={(e) => {
                update(selectedAgentData.id);
                setEditMode(false);
                setOldName('');
              }}
            />
            <IconBtn
              label={'close'}
              Icon={<Close />}
              onClick={(e) => {
                setSelectedAgentData({ ...selectedAgentData, name: oldName });
                setOldName('');
                setEditMode(false);
              }}
            />
          </div>
        ) : (
          <div className={styles.agentDescription}>
            <Avatar className={styles.avatar}>
              {selectedAgentData.name.slice(0, 1)[0]}{' '}
            </Avatar>
            <div>
              <Typography variant="h5">{selectedAgentData.name}</Typography>
            </div>
            <IconBtn
              label={'edit'}
              Icon={<Edit />}
              onClick={(e) => {
                setEditMode(true);
                setOldName(selectedAgentData.name);
              }}
            />
          </div>
        )}

        <div className={styles.btns}>
          <Button
            onClick={() => {
              update(selectedAgentData?.id);
            }}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'purple',
            }}
          >
            Update
          </Button>
          <Button
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'purple',
            }}
            onClick={() => exportAgent()}
          >
            Export
          </Button>
        </div>
        <Switch
          label={null}
          checked={selectedAgentData.enabled ? true : false}
          onChange={() => {
            setSelectedAgentData({
              ...selectedAgentData,
              enabled: selectedAgentData.enabled ? false : true,
            });
          }}
          style={{ alignSelf: 'self-start' }}
        />
      </div>
      <div className="form-item agent-select">
        <span className="form-item-label">Root Spell</span>
        <select
          style={{
            appearance: 'none',
          }}
          name="rootSpell"
          id="rootSpell"
          value={selectedAgentData.rootSpell?.name || 'default'}
          onChange={(event) => {
            const newRootSpell = spellList.find(
              (spell) => spell.name === event.target.value
            );
            const inputs = pluginManager.getInputByName();
            const plugin_list = pluginManager.getPlugins();
            for (const key of Object.keys(plugin_list)) {
              if (!newRootSpell) continue;
              plugin_list[key] = validateSpellData(newRootSpell, inputs[key]);
            }
            setEnable(plugin_list);
            enqueueSnackbar(
              'Greyed out components are not available because of the selected spell.',
              {
                variant: 'info',
              }
            );

            setSelectedAgentData({
              enabled: true,
              ...selectedAgentData,
            });

            setSelectedAgentData({
              ...selectedAgentData,
              rootSpell: newRootSpell,
              publicVariables: JSON.stringify(
                Object.values(newRootSpell.graph.nodes as any)
                  .filter((node: { data }) => node?.data?.isPublic)
                  .map((node: { data; id; name }) => {
                    return {
                      id: node?.id,
                      name: node?.data?.name,
                      value: node?.data?.value,
                      type: node?.name,
                    };
                  })
                  .reduce((acc, cur) => {
                    acc[cur.id] = cur;
                    return acc;
                  }, {})
              ),
            });
          }}
        >
          <option disabled value={'default'}>
            Select Spell
          </option>
          {spellList?.length > 0 &&
            spellList.map((spell, idx) => (
              <option value={spell.name} key={idx}>
                {spell.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        {pluginManager.getSecrets(true).map((value, index) => {
          return (
            <div key={value.name + index} style={{ marginBottom: '1em' }}>
              <div style={{ width: '100%', marginBottom: '1em' }}>
                {value.name}
              </div>
              <Input
                type="password"
                name={value.key}
                id={value.key}
                style={{ width: '100%' }}
                value={
                  selectedAgentData.secrets
                    ? JSON.parse(selectedAgentData.secrets)[value.key]
                    : 'null'
                }
                onChange={(event) => {
                  setSelectedAgentData({
                    ...selectedAgentData,
                    secrets: JSON.stringify({
                      ...JSON.parse(selectedAgentData.secrets),
                      [value.key]: event.target.value,
                    }),
                  });
                }}
              />
            </div>
          );
        })}
      </div>
      {selectedAgentData.publicVariables !== '{}' && (
        <AgentPubVariables
          setPublicVars={(data) => {
            setSelectedAgentData({
              ...selectedAgentData,
              publicVariables: JSON.stringify(data),
            });
          }}
          publicVars={JSON.parse(selectedAgentData.publicVariables)}
        />
      )}
      <div
        className={`${
          selectedAgentData.publicVariables !== '{}'
            ? styles.connectorsLong
            : styles.connectors
        }`}
      >
        {pluginManager.getAgentComponents().map((value, index, array) => {
          return (
            <RenderComp
              key={index}
              enable={enable}
              element={value}
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
              update={update}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AgentDetails;