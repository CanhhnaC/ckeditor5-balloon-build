import { Command } from '@ckeditor/ckeditor5-core';

export class ChartCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      'chart'
    );

    this.isEnabled = allowedIn !== null;
  }

  execute(attributes) {
    const model = this.editor.model;

    model.change((writer) => {
      this.editor.model.insertContent(
        writer.createElement('chart', attributes)
      );
    });
  }
}
