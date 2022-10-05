import { Command } from '@ckeditor/ckeditor5-core';

export class ChartStyleCommand extends Command {
  constructor(editor, styles) {
    super(editor);
    this._defaultStyles = {
      chart: false,
    };

    this._styles = new Map(
      styles.map((style) => {
        if (style.isDefault) {
          for (const modelElementName of style.modelElements) {
            this._defaultStyles[modelElementName] = style.name;
          }
        }

        return [style.name, style];
      })
    );
  }

  refresh() {
    const editor = this.editor;
    const chartUtils = editor.plugins.get('ChartUtils');
    const element = chartUtils.getClosestSelectedChartElement(
      this.editor.model.document.selection
    );

    this.isEnabled = !!element;

    if (!this.isEnabled) {
      this.value = false;
    } else if (element.hasAttribute('chartStyle')) {
      this.value = element.getAttribute('chartStyle');
    } else {
      this.value = this._defaultStyles[element.name];
    }
  }

  execute(options = {}) {
    const editor = this.editor;
    const model = editor.model;
    const chartUtils = editor.plugins.get('ChartUtils');

    model.change((writer) => {
      const requestedStyle = options.value;

      let chartElement = chartUtils.getClosestSelectedChartElement(
        model.document.selection
      );

      // Change the chart type if a style requires it.
      if (
        requestedStyle &&
        this.shouldConvertChartType(requestedStyle, chartElement)
      ) {
        // this.editor.execute("chartTypeBlock");
        // Update the chartElement to the newly created chart.
        // chartElement = chartUtils.getClosestSelectedChartElement(
        //   model.document.selection
        // );
      }

      // Default style means that there is no `chartStyle` attribute in the model.
      // https://github.com/ckeditor/ckeditor5-chart/issues/147
      if (!requestedStyle || this._styles.get(requestedStyle).isDefault) {
        writer.removeAttribute('chartStyle', chartElement);
      } else {
        writer.setAttribute('chartStyle', requestedStyle, chartElement);
      }
    });
  }

  shouldConvertChartType(requestedStyle, chartElement) {
    const supportedTypes = this._styles.get(requestedStyle).modelElements;

    return !supportedTypes.includes(chartElement.name);
  }
}
