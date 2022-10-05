import { Plugin } from '@ckeditor/ckeditor5-core';
import { ChartResizeButtons } from './chart-resize/chart-resize-buttons';
import { ChartResizeEditing } from './chart-resize/chart-resize-editing';
import { ChartResizeHandles } from './chart-resize/chart-resize-handles';

import './theme/chart-resize.css';

export class ChartResize extends Plugin {
  static get requires() {
    return [ChartResizeEditing, ChartResizeHandles, ChartResizeButtons];
  }

  static get pluginName() {
    return 'ChartResize';
  }
}
