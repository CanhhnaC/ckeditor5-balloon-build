import { Plugin } from '@ckeditor/ckeditor5-core';
import ExportPdfUI from './export-pdf-ui';

import './theme/export-pdf.css';

export class ExportPdf extends Plugin {
  static get requires() {
    return [ExportPdfUI];
  }

  static get pluginName() {
    return 'ExportPdf';
  }
}
