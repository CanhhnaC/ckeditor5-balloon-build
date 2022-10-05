import { Plugin } from '@ckeditor/ckeditor5-core';
import { WidgetToolbarRepository } from '@ckeditor/ckeditor5-widget';
import { isObject } from 'lodash';
import { ChartUtils } from './chart-utils';

export class ChartToolbar extends Plugin {
  static get requires() {
    return [WidgetToolbarRepository, ChartUtils];
  }

  static get pluginName() {
    return 'ChartToolbar';
  }

  afterInit() {
    const editor = this.editor;
    const t = editor.t;
    const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);
    const chartUtils = editor.plugins.get('ChartUtils');
    widgetToolbarRepository.register('chart', {
      ariaLabel: t('Chart toolbar'),
      items: normalizeDeclarativeConfig(
        editor.config.get('chart.toolbar') || []
      ),
      getRelatedElement: (selection) =>
        chartUtils.getClosestSelectedChartWidget(selection),
    });
  }
}

function normalizeDeclarativeConfig(config) {
  return config.map((item) => (isObject(item) ? item.name : item));
}
