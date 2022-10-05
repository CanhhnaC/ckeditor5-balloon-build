import {
  ButtonView,
  createDropdown,
  addToolbarToDropdown,
} from '@ckeditor/ckeditor5-ui';
import { Plugin } from '@ckeditor/ckeditor5-core';
import { icons } from './theme/icons';

import icon from './theme/icons/chart-icon.svg';

const iconsMap = new Map([
  ['pie', icons.chartPie],
  ['line', icons.chartLine],
  ['area', icons.chartArea],
  ['bar', icons.chartBar],
  ['column', icons.chartColumn],
  ['scatter', icons.chartScatter],
]);

export class ChartUI extends Plugin {
  static get pluginName() {
    return 'ChartUI';
  }

  init() {
    const editor = this.editor;
    const componentFactory = editor.ui.componentFactory;
    const t = editor.t;
    const options = editor.config.get('chart.options');

    this.getChartTemplate = editor.config.get('chart').getChartTemplate;

    options.forEach((option) => this._addButton(option));

    componentFactory.add('chart', (locale) => {
      const dropdownView = createDropdown(locale);

      const buttons = options.map((option) =>
        componentFactory.create(`chart:${option.name}`)
      );
      addToolbarToDropdown(dropdownView, buttons, {
        enableActiveItemFocusOnDropdownOpen: true,
      });

      dropdownView.buttonView.set({
        label: t('Chart'),
        tooltip: true,
        icon,
      });
      dropdownView.toolbarView.isVertical = true;
      dropdownView.toolbarView.ariaLabel = t('Chart toolbar');
      dropdownView.extendTemplate({
        attributes: {
          class: 'ck-chart-dropdown',
        },
      });

      dropdownView.buttonView
        .bind('icon')
        .toMany(buttons, 'isOn', (...areActive) => {
          const index = areActive.findIndex((value) => value);
          if (index < 0) {
            return icon;
          }

          return buttons[index].icon;
        });

      dropdownView
        .bind('isEnabled')
        .toMany(buttons, 'isEnabled', (...areEnabled) =>
          areEnabled.some((isEnabled) => isEnabled)
        );

      this.listenTo(dropdownView, 'execute', () => {
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }

  _addButton({ name, label, id }) {
    const editor = this.editor;
    editor.ui.componentFactory.add(`chart:${name}`, (locale) => {
      const command = editor.commands.get('chart');
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label,
        icon: iconsMap.get(name),
        tooltip: true,
      });

      buttonView.bind('isEnabled').to(command);
      buttonView.bind('isOn').to(command, 'value', (value) => value === name);

      this.listenTo(buttonView, 'execute', async () => {
        const { attributes } = await this.getChartTemplate(id);

        Object.assign(attributes, {
          'chart-config': JSON.stringify(attributes['chart-config']),
        });

        editor.execute('chart', attributes);
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}
