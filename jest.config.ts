import { getJestProjects } from '@nx/jest'

export default {
  projects: getJestProjects(),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
}
