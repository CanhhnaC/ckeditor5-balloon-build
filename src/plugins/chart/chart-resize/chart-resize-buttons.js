import { Plugin, icons } from '@ckeditor/ckeditor5-core';
import {
  ButtonView,
  DropdownButtonView,
  Model,
  createDropdown,
  addListToDropdown,
} from '@ckeditor/ckeditor5-ui';
import { CKEditorError, Collection } from '@ckeditor/ckeditor5-utils';

import { ChartResizeEditing } from './chart-resize-editing';

const RESIZE_ICONS = {
  small: icons.objectSizeSmall,
  medium: icons.objectSizeMedium,
  large: icons.objectSizeLarge,
  original: icons.objectSizeFull,
};

export class ChartResizeButtons extends Plugin {
  static get requires() {
    return [ChartResizeEditing];
  }

  static get pluginName() {
    return 'ChartResizeButtons';
  }

  constructor(editor) {
    super(editor);

    this._resizeUnit = editor.config.get('chart.resizeUnit');
  }

  init() {
    const editor = this.editor;
    const options = editor.config.get('chart.resizeOptions');
    const command = editor.commands.get('resizeChart');

    this.bind('isEnabled').to(command);

    for (const option of options) {
      this._registerChartResizeButton(option);
    }

    this._registerChartResizeDropdown(options);
  }

  _registerChartResizeButton(option) {
    const editor = this.editor;
    const { name, value, icon } = option;
    const optionValueWithUnit = value ? value + this._resizeUnit : null;

    editor.ui.componentFactory.add(name, (locale) => {
      const button = new ButtonView(locale);
      const command = editor.commands.get('resizeChart');
      const labelText = this._getOptionLabelValue(option, true);

      if (!RESIZE_ICONS[icon]) {
        throw new CKEditorError(
          'chartresizebuttons-missing-icon',
          editor,
          option
        );
      }

      button.set({
        // Use the `label` property for a verbose description (because of ARIA).
        label: labelText,
        icon: RESIZE_ICONS[icon],
        tooltip: labelText,
        isToggleable: true,
      });

      // Bind button to the command.
      button.bind('isEnabled').to(this);
      button
        .bind('isOn')
        .to(command, 'value', getIsOnButtonCallback(optionValueWithUnit));

      this.listenTo(button, 'execute', () => {
        editor.execute('resizeChart', { width: optionValueWithUnit });
      });

      return button;
    });
  }

  _registerChartResizeDropdown(options) {
    const editor = this.editor;
    const t = editor.t;
    const originalSizeOption = options.find((option) => !option.value);

    const componentCreator = (locale) => {
      const command = editor.commands.get('resizeChart');
      const dropdownView = createDropdown(locale, DropdownButtonView);
      const dropdownButton = dropdownView.buttonView;

      dropdownButton.set({
        tooltip: t('Resize chart'),
        commandValue: originalSizeOption.value,
        icon: RESIZE_ICONS.medium,
        isToggleable: true,
        label: this._getOptionLabelValue(originalSizeOption),
        withText: true,
        class: 'ck-resize-chart-button',
      });

      dropdownButton.bind('label').to(command, 'value', (commandValue) => {
        if (commandValue && commandValue.width) {
          return commandValue.width;
        } else {
          return this._getOptionLabelValue(originalSizeOption);
        }
      });
      dropdownView.bind('isOn').to(command);
      dropdownView.bind('isEnabled').to(this);

      addListToDropdown(
        dropdownView,
        this._getResizeDropdownListItemDefinitions(options, command)
      );

      dropdownView.listView.ariaLabel = t('Chart resize list');

      // Execute command when an item from the dropdown is selected.
      this.listenTo(dropdownView, 'execute', (evt) => {
        editor.execute(evt.source.commandName, {
          width: evt.source.commandValue,
        });
        editor.editing.view.focus();
      });

      return dropdownView;
    };

    // Register `resizeChart` dropdown and add `chartResize` dropdown as an alias for backward compatibility.
    editor.ui.componentFactory.add('resizeChart', componentCreator);
    editor.ui.componentFactory.add('chartResize', componentCreator);
  }

  _getOptionLabelValue(option, forTooltip) {
    const t = this.editor.t;

    if (option.label) {
      return option.label;
    } else if (forTooltip) {
      if (option.value) {
        return t('Resize chart to %0', option.value + this._resizeUnit);
      } else {
        return t('Resize chart to the original size');
      }
    } else {
      if (option.value) {
        return option.value + this._resizeUnit;
      } else {
        return t('Original');
      }
    }
  }

  _getResizeDropdownListItemDefinitions(options, command) {
    const itemDefinitions = new Collection();

    options.map((option) => {
      const optionValueWithUnit = option.value
        ? option.value + this._resizeUnit
        : null;
      const definition = {
        type: 'button',
        model: new Model({
          commandName: 'resizeChart',
          commandValue: optionValueWithUnit,
          label: this._getOptionLabelValue(option),
          withText: true,
          icon: null,
        }),
      };

      definition.model
        .bind('isOn')
        .to(command, 'value', getIsOnButtonCallback(optionValueWithUnit));

      itemDefinitions.add(definition);
    });

    return itemDefinitions;
  }
}

// A helper function for setting the `isOn` state of buttons in value bindings.
function getIsOnButtonCallback(value) {
  return (commandValue) => {
    if (value === null && commandValue === value) {
      return true;
    }

    return commandValue && commandValue.width === value;
  };
}
