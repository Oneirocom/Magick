import { FC } from 'react'

interface HeaderProps {
  sortType: string
}

export const Header: FC<HeaderProps> = ({ sortType }) => {
  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col gap-y-1">
        <div className="inline-flex items-center space-x-2">
          <h2>Your Secrets</h2>
        </div>
        <p>
          Here you can create and manage your secrets. Secrets are encrypted and
          stored in your project. When you're ready to use them, click the
          button above to go to the Config Window and link them to your agent.
        </p>
      </div>
    </div>
  )
}
