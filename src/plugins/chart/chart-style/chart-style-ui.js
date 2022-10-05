import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { ChartStyleEditing } from './chart-style-editing';

export class ChartStyleUI extends Plugin {
  static get requires() {
    return [ChartStyleEditing];
  }

  static get pluginName() {
    return 'ChartStyleUI';
  }

  get localizedDefaultStylesTitles() {
    const t = this.editor.t;

    return {
      'Wrap text': t('Wrap text'),
      'Break text': t('Break text'),
      'In line': t('In line'),
      'Full size chart': t('Full size chart'),
      'Side chart': t('Side chart'),
      'Left aligned chart': t('Left aligned chart'),
      'Centered chart': t('Centered chart'),
      'Right aligned chart': t('Right aligned chart'),
    };
  }

  init() {
    const plugins = this.editor.plugins;

    const definedStyles = translateStyles(
      plugins.get('ChartStyleEditing').normalizedStyles,
      this.localizedDefaultStylesTitles
    );

    for (const styleConfig of definedStyles) {
      this._createButton(styleConfig);
    }
  }

  _createButton(buttonConfig) {
    const buttonName = buttonConfig.name;

    this.editor.ui.componentFactory.add(
      getUIComponentName(buttonName),
      (locale) => {
        const command = this.editor.commands.get('chartStyle');
        const view = new ButtonView(locale);

        view.set({
          label: buttonConfig.title,
          icon: buttonConfig.icon,
          tooltip: true,
          isToggleable: true,
        });

        view.bind('isEnabled').to(command, 'isEnabled');
        view.bind('isOn').to(command, 'value', (value) => value === buttonName);
        view.on('execute', this._executeCommand.bind(this, buttonName));

        return view;
      }
    );
  }

  _executeCommand(name) {
    this.editor.execute('chartStyle', { value: name });
    this.editor.editing.view.focus();
  }
}

function getUIComponentName(name) {
  return `chartStyle:${name}`;
}

function translateStyles(styles, titles) {
  for (const style of styles) {
    if (titles[style.title]) {
      style.title = titles[style.title];
    }
  }

  return styles;
}
