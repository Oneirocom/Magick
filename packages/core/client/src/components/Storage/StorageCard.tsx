import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@magickml/ui'
import clsx from 'clsx'
import { FunctionComponent } from 'react'

type StorageCardProps = {
  id: string
  model: string
  type: 'image' | 'audio' | 'video'
  createdAt: string
  urls: string[]
}

const StorageCard: FunctionComponent<StorageCardProps> = ({
  id,
  model,
  type,
  createdAt,
  urls,
}) => {
  const previewUrls =
    type === 'audio'
      ? urls.slice(0, 2)
      : type === 'video'
      ? urls.slice(0, 1)
      : urls.slice(0, 3)
  return (
    <Card className="col-span-1 max-w-sm w-full mx-auto h-[220px] bg-black-500 rounded-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl inline-flex items-center justify-between">
          {type.charAt(0).toUpperCase() + type.slice(1)}
          {type === 'audio' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
              />
            </svg>
          ) : type === 'video' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          )}
        </CardTitle>
        <CardDescription>Model: {model}</CardDescription>
      </CardHeader>
      <CardContent className="max-w-sm h-32 mx-auto oveflow-hidden">
        <div
          className={clsx(
            type === 'audio' ? 'flex-col justify-evenly' : 'flex-row',
            'w-full h-full overflow-hidden flex gap-4'
          )}
        >
          {previewUrls.map((url, index) =>
            type === 'image' ? (
              <img className="h-24" src={url} alt="Image" key={index} />
            ) : type === 'audio' ? (
              <audio controls key={index} className="w-80 mx-auto">
                <source src={url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <video controls className="mx-auto" key={index}>
                <source src={url} type="video/avi" />
                Your browser does not support the video tag.
              </video>
            )
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full text-xl">View</Button>
      </CardFooter>
    </Card>
  )
}

export default StorageCard
