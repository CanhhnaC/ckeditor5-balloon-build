import { Plugin } from '@ckeditor/ckeditor5-core';
import { ChartStyleEditing } from './chart-style/chart-style-editing';
import { ChartStyleUI } from './chart-style/chart-style-ui';

import './theme/chart-style.css';

export class ChartStyle extends Plugin {
  static get requires() {
    return [ChartStyleEditing, ChartStyleUI];
  }

  static get pluginName() {
    return 'ChartStyle';
  }
}
