import { FC } from 'react'

type CredentialsHeaderProps = {
  title: string
  description: string
}

export const CredentialsHeader: FC<CredentialsHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="gap-y-1 pb-2 flex flex-col">
      <h3 className="font-semibold capitalize">{title}</h3>
      <p className="opacity-70">{description}</p>
    </div>
  )
}
