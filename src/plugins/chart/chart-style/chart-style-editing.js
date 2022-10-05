import { Plugin } from '@ckeditor/ckeditor5-core';
import { ChartUtils } from '../chart-utils';
import * as utils from './utils';
import {
  viewToModelStyleAttribute,
  modelToViewStyleAttribute,
} from './converters';
import { ChartStyleCommand } from './chart-style-command';

import '../theme/chart-style.css';

export class ChartStyleEditing extends Plugin {
  static get requires() {
    return [ChartUtils];
  }

  static get pluginName() {
    return 'ChartStyleEditing';
  }

  init() {
    const { normalizeStyles, getDefaultStylesConfiguration } = utils;
    const editor = this.editor;

    editor.config.define('chart.styles', getDefaultStylesConfiguration());

    this.normalizedStyles = normalizeStyles({
      configuredStyles: editor.config.get('chart.styles'),
    });

    this._setupConversion();
    this._setupPostFixer();

    editor.commands.add(
      'chartStyle',
      new ChartStyleCommand(editor, this.normalizedStyles)
    );
  }

  _setupConversion() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const modelToViewConverter = modelToViewStyleAttribute(
      this.normalizedStyles
    );
    const viewToModelConverter = viewToModelStyleAttribute(
      this.normalizedStyles
    );
    editor.editing.downcastDispatcher.on(
      'attribute:chartStyle',
      modelToViewConverter
    );
    editor.data.downcastDispatcher.on(
      'attribute:chartStyle',
      modelToViewConverter
    );
    schema.extend('chart', { allowAttributes: 'chartStyle' });
    editor.data.upcastDispatcher.on('element:chart', viewToModelConverter, {
      priority: 'low',
    });
  }

  _setupPostFixer() {
    const editor = this.editor;
    const document = editor.model.document;

    const chartUtils = editor.plugins.get(ChartUtils);
    const stylesMap = new Map(
      this.normalizedStyles.map((style) => [style.name, style])
    );

    // Make sure that style attribute is valid for the chart type.
    document.registerPostFixer((writer) => {
      let changed = false;

      for (const change of document.differ.getChanges()) {
        if (
          change.type == 'insert' ||
          (change.type == 'attribute' && change.attributeKey == 'chartStyle')
        ) {
          let element =
            change.type == 'insert'
              ? change.position.nodeAfter
              : change.range.start.nodeAfter;

          if (
            element &&
            element.is('element', 'paragraph') &&
            element.childCount > 0
          ) {
            element = element.getChild(0);
          }

          if (!chartUtils.isChart(element)) {
            continue;
          }

          const chartStyle = element.getAttribute('chartStyle');

          if (!chartStyle) {
            continue;
          }

          const chartStyleDefinition = stylesMap.get(chartStyle);

          if (
            !chartStyleDefinition ||
            !chartStyleDefinition.modelElements.includes(element.name)
          ) {
            writer.removeAttribute('chartStyle', element);
            changed = true;
          }
        }
      }

      return changed;
    });
  }
}
