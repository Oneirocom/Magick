import React from 'react'
import Typography from '@mui/material/Typography'
import { NodeModel } from '@minoru/react-dnd-treeview'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TypeIcon } from './TypeIcon'
import styles from './menu.module.css'
import { useNavigate } from 'react-router-dom'
import { useTreeData } from '../../contexts/TreeDataProvider'

type Props = {
  node: NodeModel<CustomData>
  depth: number
  isOpen: boolean
  onToggle: (id: NodeModel['id']) => void
}

type CustomData = {
  fileType: string
  fileSize: string
}

export const CustomNode: React.FC<Props> = props => {
  const { droppable, data }: any = props.node
  const indent = props.depth * 24
  const navigate = useNavigate()
  const { setOpenDoc} = useTreeData()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(props.node.id)
  }

  const handleClick = () => {
    if (props.node.fileType === 'txt') {
      setOpenDoc(props.node.id)
      navigate(`/magick/Documents-${encodeURIComponent(btoa('Documents'))}`)
    } else if (props.node.fileType === 'spell') {
      navigate(
        `/magick/${props.node.id}-${encodeURIComponent(btoa(props.node.text))}`
      )
    }
  }

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
    >
      <div
        className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ''
          }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ChevronRightIcon />
          </div>
        )}
      </div>
      <div>
        {/* @ts-ignore */}
        <TypeIcon
          droppable={droppable}
          // TODO fix the node filetype here
          // @ts-ignore
          fileType={data ? data.fileType : props.node.fileType}
        />
      </div>
      <div className={styles.labelGridItem}>
        <Typography
          variant="body1"
          sx={{
            cursor: 'pointer',
            marginLeft: '8px',
          }}
          onClick={() => handleClick()}
        >
          {props.node.text}
        </Typography>
      </div>
    </div>
  )
}
