import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // projectId: 'fffkra71',
    projectId: '2pcxhv7c',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
