import { Command } from '@ckeditor/ckeditor5-core';

export default class ExportPdfCommand extends Command {
  constructor(editor) {
    super(editor);
    this.set('isBusy', false);
    this.affectsData = false;
  }

  refresh() {
    this.isEnabled = !this.isBusy;
    this.value = this.isBusy ? 'pending' : undefined;
  }

  execute(config = {}) {
    const editor = this.editor;
    const t = editor.t;
    const converterUrl = config.converterUrl;
    const dataCallback = config.dataCallback || ((e) => e.getData());
    const token = config.token;

    this.isBusy = true;
    this.refresh();

    const body = {
      html:
        '<html><head><meta charset="utf-8"></head><body><div class="ck-content" dir="' +
        editor.locale.contentLanguageDirection +
        '">' +
        dataCallback(editor) +
        '</div><body></html>',
    };

    fetch(converterUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/pdf',
        ...(token
          ? {
              Authorization: token,
            }
          : null),
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(body),
    })
      .then((res) => res.blob())
      .then((res) => this.downLoadPdf(res, config.fileName || 'document.pdf'))
      .catch((err) => {
        throw (
          (editor.plugins
            .get('Notification')
            .showWarning(t('An error occurred while generating the PDF.')),
          err)
        );
      })
      .finally(() => {
        this.isBusy = false;
        this.refresh();
      });
  }

  downLoadPdf(e, t) {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(e);
    a.download = t;
    a.click();
    a.remove();
  }
}
