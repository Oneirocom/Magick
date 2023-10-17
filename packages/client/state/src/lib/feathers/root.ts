import { createFeathersReduxToolkit } from '@magickml/feathersRedux'
import { feathersClient } from 'client/feathers-client'

const rootFeathers = createFeathersReduxToolkit(feathersClient.getClient())

export const { configureFeathersStore } = rootFeathers

export default rootFeathers
