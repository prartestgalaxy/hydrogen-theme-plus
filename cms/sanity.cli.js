import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // projectId: 'fffkra71',
    projectId: 'v7oqr7vc',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    appID:'a2nzzox9lu3ggxgat8n4k2qf',
    autoUpdates: true,
  }
})
