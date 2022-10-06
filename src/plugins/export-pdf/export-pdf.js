import { Plugin } from '@ckeditor/ckeditor5-core';
import { Notification } from '@ckeditor/ckeditor5-ui';
import ExportPdfUI from './export-pdf-ui';

import './theme/export-pdf.css';

export class ExportPdf extends Plugin {
  static get requires() {
    return [ExportPdfUI, Notification];
  }

  static get pluginName() {
    return 'ExportPdf';
  }
}
