import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';
import { ChartEditing } from './chart-editing';
import { ChartUI } from './chart-ui';

import './theme/chart.css';

export class Chart extends Plugin {
  static get requires() {
    return [ChartEditing, ChartUI, Widget];
  }

  static get PluginName() {
    return 'Chart';
  }
}
