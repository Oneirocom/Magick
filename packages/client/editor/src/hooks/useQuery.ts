// DOCUMENTED
/**
 * a utility function that extracts and returns query parameters from the URL of the current page
 * @returns {URLSearchParams} a URL search Params object containing the query parameters of the current URL
 */

import { useLocation } from 'react-router-dom'

export const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search)
}
