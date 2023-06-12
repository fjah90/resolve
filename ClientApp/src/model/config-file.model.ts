export interface ConfigurationFile {
  endpoints: Endpoint[];
  editarSucursal: string;
  sucursales: number[];
  sensitiveRequired: boolean;
  dateWindow: number;
}

export interface Endpoint {
  name: string;
  uri: string;
  key: string | null;
}
