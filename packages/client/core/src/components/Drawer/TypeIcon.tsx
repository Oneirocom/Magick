import React from 'react'
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'

type Props = {
  droppable: boolean
  fileType?: string
}

export const TypeIcon: React.FC<Props> = props => {
  if (props.droppable) {
    return <FolderOpenOutlinedIcon style={{ color: '#F4CC22' }} />
  }

  switch (props.fileType) {
    case 'txt':
      return <DescriptionOutlinedIcon style={{ color: '#42B951' }} />
    case 'prompt':
      return <HistoryEduOutlinedIcon style={{ color: '#1BC5EB' }} />
    case 'spell':
      return <AutoStoriesIcon fontSize="small" style={{ color: 'white' }} />
    case 'behave':
      return <AccountTreeIcon fontSize="small" style={{ color: 'white' }} />

    default:
      return null
  }
}
