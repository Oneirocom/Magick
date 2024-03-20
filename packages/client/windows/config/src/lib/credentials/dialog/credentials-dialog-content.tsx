import { Tabs, TabsContent, TabsList, TabsTrigger } from '@magickml/client-ui'

export enum CredentialDialogTab {
  NEW = 'new',
  EXISTING = 'existing',
}

interface CredentialDialogContentProps {
  newContent: React.ReactNode
  existingContent: React.ReactNode
  state: [CredentialDialogTab, (value: CredentialDialogTab) => void]
}

export const CredentialDialogContent: React.FC<
  CredentialDialogContentProps
> = ({ newContent, existingContent, state }) => {
  return (
    <Tabs
      value={state[0] as CredentialDialogTab}
      onValueChange={value => state[1](value as CredentialDialogTab)} // safe to cast
      defaultValue={CredentialDialogTab.EXISTING}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value={CredentialDialogTab.EXISTING}>Existing</TabsTrigger>
        <TabsTrigger value={CredentialDialogTab.NEW}>New</TabsTrigger>
      </TabsList>
      <TabsContent value={CredentialDialogTab.EXISTING}>
        {existingContent}
      </TabsContent>
      <TabsContent value={CredentialDialogTab.NEW}>{newContent}</TabsContent>
    </Tabs>
  )
}
