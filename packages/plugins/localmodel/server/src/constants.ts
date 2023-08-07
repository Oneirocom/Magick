// DOCUMENTED 
/**
 * The local endpoint URL.
 * Attempts to retrieve from various environment variables, falls back to default endpoint if not found.
 */
export const LOCALMODEL_ENPOINT =
  process.env['VITE_LOCALMODEL_ENPOINT'] ||
  process.env['NEXT_LOCALMODEL_ENPOINT'] ||
  process.env['REACT_APP_LOCALMODEL_ENPOINT'] ||
  process.env['LOCALMODEL_ENPOINT'] ||
  'http://127.0.0.1:5001/v1';