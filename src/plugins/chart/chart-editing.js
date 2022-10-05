import { Plugin } from '@ckeditor/ckeditor5-core';
import { toWidget } from '@ckeditor/ckeditor5-widget';
import { ChartCommand } from './chart-command';

import { ALLOW_ATTRIBUTES, attributesToObject } from './chart-utils';

export class ChartEditing extends Plugin {
  static get pluginName() {
    return 'ChartEditing';
  }

  constructor(editor) {
    super(editor);
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('chart', new ChartCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('chart', {
      // Behaves like a self-contained object (e.g. an chart).
      isObject: true,

      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$block',

      allowAttributes: ALLOW_ATTRIBUTES,
    });
  }

  _defineConverters() {
    const editor = this.editor;
    const conversion = editor.conversion;
    const renderChart = editor.config.get('chart').chartRenderer;

    // <chart> converters ((data) view -> model)
    conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: 'chart',
      },
      model: (viewElement, { writer: modelWriter }) => {
        const attributes = attributesToObject(viewElement.getAttributes());
        return modelWriter.createElement('chart', attributes);
      },
    });

    // <chart> converters ((data) model -> data view)
    conversion.for('dataDowncast').elementToElement({
      model: 'chart',
      view: (modelElement, { writer: viewWriter }) => {
        // In the data view, the model <chart> corresponds to:
        //
        // <div class="chart-container"></div>

        const attributes = attributesToObject(modelElement.getAttributes());
        return viewWriter.createEmptyElement('div', attributes);
      },
    });

    // <chart> converters ( model -> editing view)
    conversion.for('editingDowncast').elementToElement({
      model: 'chart',
      view: (modelElement, { writer: viewWriter }) => {
        // In the editing view, the model <chart> corresponds to:
        //
        // <div class="chart">
        //  <div class="chart__react-wrapper">
        //    <Chart/> (React component)
        //  </div>
        // </div>

        const attributes = attributesToObject(modelElement.getAttributes());
        const div = viewWriter.createContainerElement('div', attributes);

        viewWriter.setCustomProperty('chart', true, div);

        const reactWrapper = viewWriter.createRawElement(
          'div',
          {
            class: 'chart__react-wrapper',
          },
          function (domElement) {
            renderChart(domElement, attributes);
          }
        );
        viewWriter.insert(viewWriter.createPositionAt(div, 0), reactWrapper);
        return toWidget(div, viewWriter, { label: 'chart widget' });
      },
    });
  }
}
