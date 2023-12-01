import { createFeathersReduxToolkit } from '@magickml/feathersRedux'

const rootFeathers = createFeathersReduxToolkit()

export const { configureFeathersStore } = rootFeathers

export default rootFeathers
