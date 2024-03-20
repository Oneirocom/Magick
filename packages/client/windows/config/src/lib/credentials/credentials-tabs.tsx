import { Tabs, TabsContent, TabsList, TabsTrigger } from '@magickml/client-ui'

export enum CredentialsTab {
  CORE = 'core',
  PLUGIN = 'plugin',
  CUSTOM = 'custom',
}

type CredentialsTabsProps = {
  value: CredentialsTab
  setTab: (tab: CredentialsTab) => void
  core?: React.ReactNode
  plugin?: React.ReactNode
  custom?: React.ReactNode
}

export const CredentialsTabs: React.FC<CredentialsTabsProps> = ({
  value,
  setTab,
  core,
  plugin,
  custom,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={setTab as (value: string) => void} // safe to cast with the enum
      defaultValue={CredentialsTab.CORE}
      className="w-full"
    >
      <TabsList>
        {Object.values(CredentialsTab).map(tab => (
          <TabsTrigger className="capitalize" key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.values(CredentialsTab).map(tab => (
        <TabsContent className="pt-2" key={tab} value={tab}>
          {tab === CredentialsTab.CORE && core}
          {tab === CredentialsTab.PLUGIN && plugin}
          {tab === CredentialsTab.CUSTOM && custom}
        </TabsContent>
      ))}
    </Tabs>
  )
}
