import { Plugin } from '@ckeditor/ckeditor5-core';
import { ChartUtils } from '../chart-utils';
import { ResizeChartCommand } from './chart-resize-command';

export class ChartResizeEditing extends Plugin {
  static get requires() {
    return [ChartUtils];
  }

  static get pluginName() {
    return 'ChartResizeEditing';
  }

  constructor(editor) {
    super(editor);

    editor.config.define('chart', {
      resizeUnit: '%',
      resizeOptions: [
        {
          name: 'resizeChart:original',
          value: null,
          icon: 'original',
        },
        {
          name: 'resizeChart:25',
          value: '25',
          icon: 'small',
        },
        {
          name: 'resizeChart:50',
          value: '50',
          icon: 'medium',
        },
        {
          name: 'resizeChart:75',
          value: '75',
          icon: 'large',
        },
      ],
    });
  }

  init() {
    const editor = this.editor;
    const resizeChartCommand = new ResizeChartCommand(editor);

    this._registerSchema();
    this._registerConverters('chart');

    // Register `resizeChart` command and add `chartResize` command as an alias for backward compatibility.
    editor.commands.add('resizeChart', resizeChartCommand);
    editor.commands.add('chartResize', resizeChartCommand);
  }

  _registerSchema() {
    this.editor.model.schema.extend('chart', {
      allowAttributes: 'width',
    });
  }

  _registerConverters(chartType) {
    const editor = this.editor;

    // Dedicated converter to propagate chart's attribute to the img tag.
    editor.conversion.for('downcast').add((dispatcher) =>
      dispatcher.on(
        `attribute:width:${chartType}`,
        (evt, data, conversionApi) => {
          if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
          }

          const viewWriter = conversionApi.writer;
          const figure = conversionApi.mapper.toViewElement(data.item);

          if (data.attributeNewValue !== null) {
            viewWriter.setStyle('width', data.attributeNewValue, figure);
            viewWriter.addClass('chart_resized', figure);
          } else {
            viewWriter.removeStyle('width', figure);
            viewWriter.removeClass('chart_resized', figure);
          }
        }
      )
    );

    editor.conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'div',
        styles: {
          width: /.+/,
        },
      },
      model: {
        key: 'width',
        value: (viewElement) => viewElement.getStyle('width'),
      },
    });
  }
}
