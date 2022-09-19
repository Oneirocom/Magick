import VideoInput from '@/screens/HomeScreen/components/VideoInput'
import Window from '../../../components/Window/Window'

import '../../../screens/Thoth/thoth.module.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const VideoTranscription = () => {
  const { enqueueSnackbar } = useSnackbar()
  const loadFile = selectedFile => {
    uploadFile(selectedFile)
  }

  const uploadFile = async(file) => {
    let formData = new FormData();
    formData.append('video', file)
    let url = `${process.env.REACT_APP_API_URL}/video`
    try {
      await axios.post(url, formData)
      enqueueSnackbar('Video uploaded', { variant: 'success' })
    } catch (err) {
      console.log(err)
      enqueueSnackbar('Video not uploaded', { variant: 'error' })
    }
  }

  return (
    <Window>
    <p>Upload Video</p>
    <VideoInput loadFile={loadFile} />
    </Window>
  )
}

export default VideoTranscription