import { Injectable } from '@angular/core';
import * as ExcelJs from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  dataForExport: any[] = [];
  headerForExport: string[] = [];
  auxForExport: string[] = [];

  constructor(private datePipe: DatePipe) {}

  generateExcel(
    title: string,
    imprimeTitulo?: false,
    imprimeSubtitulo?: false,
    imprimeBordes?: false,
    imprimeFooter?: false
  ) {
    // Create workbook and worksheet
    const workbook = new ExcelJs.Workbook();
    // const worksheet = workbook.addWorksheet('Exportacion');
    const worksheet = workbook.addWorksheet();
    // Add Row and formatting

    //  -- TITULO --
    if (imprimeTitulo) {
      const titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'Arial', family: 4, size: 16, bold: true };
      // worksheet.addRow([]);
    }

    if (imprimeSubtitulo) {
      // -- SUBTITULO --
      const subTitleRow = worksheet.addRow([
        'Fecha de generación : ' +
          this.datePipe.transform(new Date(), 'medium'),
      ]);
      // Blank Row
      // worksheet.addRow([]);
      // Add Header Row
    }
    const headerRow = worksheet.addRow(this.headerForExport);

    if (imprimeBordes) {
      // Cell Style : Fill and Border
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    this.dataForExport.forEach((d) => {
      const row = worksheet.addRow(d);
    });
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);

    // Footer Row
    if (imprimeFooter) {
      const footerRow = worksheet.addRow([
        'Este es un archivo exportado de Portal Web de Sucursales 2.0.',
      ]);
      footerRow.getCell(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
    // Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  resetData() {
    this.dataForExport = [];
    this.auxForExport = [];
    this.headerForExport = [];
  }

  loadExportData(genericObject: any) {
    this.auxForExport = [];
    Object.entries(genericObject).forEach(([key, value]) => {
      // CREO HEADERfil
      if (key !== 'ola') {
        if (this.headerForExport.indexOf(key) < 0) {
          this.headerForExport.push(key);
        }
        // ARRAY DE VALORES
        this.auxForExport.push(String(value));
      }
    });
    // ARRAY DE ARRAYS
    this.dataForExport.push(this.auxForExport);
  }
}
