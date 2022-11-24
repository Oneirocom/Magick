import { exit } from 'process'
import {
  defaultClientData,
  defaultConfiguationData,
  defaultScopeData,
} from './defaultRecords'
import format from 'pg-format'
import { clients, connect } from './connection'

const seedClientSetting = async () => {
  let newBody = []

  for (let i = 0; i < defaultClientData.length; i++) {
    newBody.push([
      defaultClientData[i].client,
      defaultClientData[i].name,
      defaultClientData[i].type,
      defaultClientData[i].defaultValue,
    ])
  }

  const query = format(
    'INSERT INTO client_settings (client, name, type, default_value) VALUES %L returning id',
    newBody
  )

  const query1 =
    'SELECT id, client, name, type, default_value FROM client_settings WHERE is_deleted=false ORDER BY id ASC LIMIT 1'

  try {
    const res = await clients.query(query1)

    if (res?.rows?.length === 0) {
      await clients.query(query)
    }

    setTimeout(() => {
      exit(0)
    }, 3000)
  } catch (error) {
    console.log('Error => seedClientSetting => ', error)
  }
}

const seedConfigurationSetting = async () => {
  let newBody: any = []

  for (const [key, value] of Object.entries(defaultConfiguationData)) {
    newBody.push([key, value])
  }

  const query = format(
    'INSERT INTO configuration_settings (key, value) VALUES %L returning id',
    newBody
  )

  const query1 =
    'SELECT id, key, value FROM configuration_settings WHERE is_deleted=false ORDER BY id ASC LIMIT 1'

  try {
    const res = await clients.query(query1)

    if (res?.rows?.length === 0) {
      await clients.query(query)
    }

    setTimeout(() => {
      exit(0)
    }, 3000)
  } catch (error) {
    console.log('Error => seedConfigurationSetting => ', error)
  }
}

const seedScopeSetting = async () => {
  let newBody: any = []

  for (let i = 0; i < defaultScopeData.length; i++) {
    newBody.push([
      defaultScopeData[i].fullTableSize,
      defaultScopeData[i].tableSize,
      defaultScopeData[i].tables,
      defaultScopeData[i].recordCount,
    ])
  }

  const query = format(
    'INSERT INTO scope_settings (full_table_size, table_size, tables, record_count) VALUES %L returning id',
    newBody
  )

  const query1 =
    'SELECT id, full_table_size, table_size, tables, record_count FROM scope_settings WHERE is_deleted=false ORDER BY id ASC LIMIT 1'

  try {
    const res = await clients.query(query1)

    if (res?.rows?.length === 0) {
      await clients.query(query)
    }

    setTimeout(() => {
      exit(0)
    }, 3000)
  } catch (error) {
    console.log('Error => seedScopeSetting => ', error)
  }
}

// create connection with database
connect()

// seeding connection with database
seedScopeSetting()
seedClientSetting()
seedConfigurationSetting()
