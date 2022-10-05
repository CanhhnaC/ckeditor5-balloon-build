import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView, View } from '@ckeditor/ckeditor5-ui';
import ExportPdfCommand from './export-pdf-command';

import icon from './theme/export-pdf-icon.svg';

export default class ExportPdfUI extends Plugin {
  static get pluginName() {
    return 'ExportPdfUI';
  }

  init() {
    const editor = this.editor;
    const t = editor.t;
    const config = editor.config.get('exportPdf') || {};

    editor.commands.add('exportPdf', new ExportPdfCommand(editor));

    editor.ui.componentFactory.add('exportPdf', (locale) => {
      const command = editor.commands.get('exportPdf');
      const view = new ButtonView(locale);

      view.set({
        label: t('Export to PDF'),
        icon: icon,
        tooltip: true,
      });

      view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
      view.extendTemplate({
        attributes: {
          class: [view.bindTemplate.if('isOn', 'ck-exportpdf_status-pending')],
        },
      });

      const spinner = new View();

      spinner.setTemplate({
        tag: 'span',
        attributes: {
          class: ['ck', 'ck-exportpdf__spinner-container'],
        },
        children: [
          {
            tag: 'span',
            attributes: {
              class: ['ck', 'ck-exportpdf__spinner'],
            },
          },
        ],
      });

      view.children.add(spinner);

      this.listenTo(view, 'execute', () => {
        editor.execute('exportPdf', config);
        editor.editing.view.focus();
      });

      return view;
    });
  }
}
