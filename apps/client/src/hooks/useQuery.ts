import { useLocation } from 'react-router-dom'

export const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}
