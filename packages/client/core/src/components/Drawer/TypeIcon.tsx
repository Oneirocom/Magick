import React from 'react'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined'
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
      return <StarBorderPurple500OutlinedIcon style={{ color: '#9D12A4' }} />
    default:
      return null
  }
}
