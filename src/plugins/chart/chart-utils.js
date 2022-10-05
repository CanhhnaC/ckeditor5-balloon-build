import { Plugin } from '@ckeditor/ckeditor5-core';
import { isWidget } from '@ckeditor/ckeditor5-widget';
import fromPairs from 'lodash/fromPairs';

export class ChartUtils extends Plugin {
  static get pluginName() {
    return 'ChartUtils';
  }

  isChart(element) {
    return !!element && element.is('element', 'chart');
  }

  isChartWidget(viewElement) {
    return !!viewElement.getCustomProperty('chart') && isWidget(viewElement);
  }

  getClosestSelectedChartWidget(selection) {
    const selectionPosition = selection.getFirstPosition();

    if (!selectionPosition) {
      return null;
    }

    const viewElement = selection.getSelectedElement();

    if (viewElement && this.isChartWidget(viewElement)) {
      return viewElement;
    }

    let parent = selectionPosition.parent;

    while (parent) {
      if (parent.is('element') && this.isChartWidget(parent)) {
        return parent;
      }

      parent = parent.parent;
    }

    return null;
  }

  getClosestSelectedChartElement(selection) {
    const selectedElement = selection.getSelectedElement();

    return this.isChart(selectedElement)
      ? selectedElement
      : selection.getFirstPosition().findAncestor('chart');
  }
}

export function attributesToObject(attributes) {
  return fromPairs([...attributes]);
}

export const ALLOW_ATTRIBUTES = [
  'class',
  'data-src',
  'data-type',
  'chart-type',
  'chart-config',
];
