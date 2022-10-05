import { Command } from '@ckeditor/ckeditor5-core';

export class ResizeChartCommand extends Command {
  refresh() {
    const editor = this.editor;
    const chartUtils = editor.plugins.get('ChartUtils');
    const element = chartUtils.getClosestSelectedChartElement(
      editor.model.document.selection
    );

    this.isEnabled = !!element;

    if (!element || !element.hasAttribute('width')) {
      this.value = null;
    } else {
      this.value = {
        width: element.getAttribute('width'),
        height: null,
      };
    }
  }

  /**
   * Executes the command.
   *
   *		// Sets the width to 50%:
   *		editor.execute( 'resizeChart', { width: '50%' } );
   *
   *		// Removes the width attribute:
   *		editor.execute( 'resizeChart', { width: null } );
   *
   * @param {Object} options
   * @param {String|null} options.width The new width of the chart.
   * @fires execute
   */
  execute(options) {
    const editor = this.editor;
    const model = editor.model;
    const chartUtils = editor.plugins.get('ChartUtils');
    const chartElement = chartUtils.getClosestSelectedChartElement(
      model.document.selection
    );

    this.value = {
      width: options.width,
      height: null,
    };

    if (chartElement) {
      model.change((writer) => {
        writer.setAttribute('width', options.width, chartElement);
      });
    }
  }
}
