import { Plugin } from '@ckeditor/ckeditor5-core';
import { WidgetResize } from '@ckeditor/ckeditor5-widget';

import { ChartObserver } from '../chart-observer';

const RESIZABLE_CHARTS_CSS_SELECTOR =
  'div.chart.ck-widget > .chart__react-wrapper';

const CHART_WIDGETS_CLASSES_MATCH_REGEXP = /chart/;

const RESIZED_CHART_CLASS = 'chart_resized';

export class ChartResizeHandles extends Plugin {
  static get requires() {
    return [WidgetResize];
  }

  static get pluginName() {
    return 'ChartResizeHandles';
  }

  init() {
    const command = this.editor.commands.get('resizeChart');
    this.bind('isEnabled').to(command);

    this._setupResizerCreator();
  }

  _setupResizerCreator() {
    const editor = this.editor;
    const editingView = editor.editing.view;

    editingView.addObserver(ChartObserver);

    this.listenTo(editingView.document, 'chartLoaded', (_evt, domEvent) => {
      const domConverter = editor.editing.view.domConverter;

      const widgetView = domConverter.domToView(domEvent);

      let resizer = this.editor.plugins
        .get(WidgetResize)
        .getResizerByViewElement(widgetView);

      if (resizer) {
        resizer.redraw();
        return;
      }

      const mapper = editor.editing.mapper;
      const chartModel = mapper.toModelElement(widgetView);

      resizer = editor.plugins.get(WidgetResize).attachTo({
        unit: editor.config.get('chart.resizeUnit'),
        modelElement: chartModel,
        viewElement: widgetView,
        editor,
        getHandleHost(domWidgetElement) {
          return domWidgetElement.querySelector('div');
        },
        getResizeHost() {
          return domConverter.mapViewToDom(
            mapper.toViewElement(chartModel.parent)
          );
        },
        isCentered() {
          const chartStyle = chartModel.getAttribute('chartStyle');
          return (
            !chartStyle || chartStyle === 'block' || chartStyle == 'alignCenter'
          );
        },

        onCommit(newValue) {
          editingView.change((writer) => {
            writer.removeClass(RESIZED_CHART_CLASS, widgetView);
          });

          editor.execute('resizeChart', { width: newValue });
        },
      });

      resizer.on('updateSize', () => {
        if (!widgetView.hasClass(RESIZED_CHART_CLASS)) {
          editingView.change((writer) => {
            writer.addClass(RESIZED_CHART_CLASS, widgetView);
          });
        }
      });

      resizer.bind('isEnabled').to(this);
    });
  }
}
