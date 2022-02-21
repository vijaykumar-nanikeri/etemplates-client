import { Injectable } from '@angular/core';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class DownloadTemplateService {
  constructor() {}

  download(
    filetype: string,
    previewId: string,
    filename: string,
    processedText?: string
  ) {
    switch (filetype) {
      case 'pdf':
        this.createAndDownloadPdf(filename, previewId);
        break;

      case 'doc':
        this.createAndDownloadDocx(filename, processedText);
        break;
    }
  }

  createAndDownloadPdf(filename: string, previewId: string) {
    const htmlElement: any = document.getElementById(previewId);

    html2canvas(htmlElement).then((canvas: any) => {
      // a4: 210mm X 297mm
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      console.log(imgWidth, imgHeight, canvas.width, canvas.height);

      const contentDataUrl = canvas.toDataURL('image/png');
      const pdf = new jspdf('portrait', 'mm', 'a4');
      pdf.addImage(contentDataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

      const aliasFilename = 'document.pdf';
      pdf.save(`${filename}.pdf` || aliasFilename);
    });
  }

  createAndDownloadDocx(filename: string, processedText?: string) {
    const header = `<html
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
          <title>eTemplate</title>
          </meta>
        </head>
        <body>`;

    const footer = '</body></html>';

    const html = `${header}${processedText}${footer}`;

    // Specify link url
    const url = `data:application/vnd.ms-word;charset=utf-8, ${encodeURIComponent(
      html
    )}`;

    // Specify file name
    const aliasFilename = 'document.doc';

    // Create download link element
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${filename}.doc` || aliasFilename;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
  }
}
