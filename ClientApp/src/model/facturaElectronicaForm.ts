export interface FacturaElectronicaForm {
  sensitive: string;
  branchOfficeNumber: number;
  fromDate?: string;
  toDate?: string;
  pointOfSale: number;
  fromAmount: number;
  toAmount: number;
  detailCUF: string;
  hasError?: boolean;
}
