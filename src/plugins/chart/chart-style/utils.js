import { icons } from '@ckeditor/ckeditor5-core';
import { logWarning } from '@ckeditor/ckeditor5-utils';

export const {
  objectFullWidth,
  objectInline,
  objectLeft,
  objectRight,
  objectCenter,
  objectBlockLeft,
  objectBlockRight,
} = icons;

export const DEFAULT_OPTIONS = {
  // This style represents an chart placed in the line of text.
  get inline() {
    return {
      name: 'inline',
      title: 'In line',
      icon: objectInline,
      modelElements: ['chartInline'],
      isDefault: true,
    };
  },

  // This style represents an chart aligned to the left and wrapped with text.
  get alignLeft() {
    return {
      name: 'alignLeft',
      title: 'Left aligned chart',
      icon: objectLeft,
      modelElements: ['chart', 'chartInline'],
      className: 'chart-style-align-left',
    };
  },

  // This style represents an chart aligned to the left.
  get alignBlockLeft() {
    return {
      name: 'alignBlockLeft',
      title: 'Left aligned chart',
      icon: objectBlockLeft,
      modelElements: ['chart'],
      className: 'chart-style-block-align-left',
    };
  },

  // This style represents a centered chart.
  get alignCenter() {
    return {
      name: 'alignCenter',
      title: 'Centered chart',
      icon: objectCenter,
      modelElements: ['chart'],
      className: 'chart-style-align-center',
    };
  },

  // This style represents an chart aligned to the right and wrapped with text.
  get alignRight() {
    return {
      name: 'alignRight',
      title: 'Right aligned chart',
      icon: objectRight,
      modelElements: ['chart', 'chartInline'],
      className: 'chart-style-align-right',
    };
  },

  // This style represents an chart aligned to the right.
  get alignBlockRight() {
    return {
      name: 'alignBlockRight',
      title: 'Right aligned chart',
      icon: objectBlockRight,
      modelElements: ['chart'],
      className: 'chart-style-block-align-right',
    };
  },

  // This option is equal to the situation when no style is applied.
  get block() {
    return {
      name: 'block',
      title: 'Centered chart',
      icon: objectCenter,
      modelElements: ['chart'],
      isDefault: true,
    };
  },

  // This represents a side chart.
  get side() {
    return {
      name: 'side',
      title: 'Side chart',
      icon: objectRight,
      modelElements: ['chart'],
      className: 'chart-style-side',
    };
  },
};

const DEFAULT_ICONS = {
  full: objectFullWidth,
  left: objectBlockLeft,
  right: objectBlockRight,
  center: objectCenter,
  inlineLeft: objectLeft,
  inlineRight: objectRight,
  inline: objectInline,
};

const DEFAULT_DROPDOWN_DEFINITIONS = [
  {
    name: 'chartStyle:wrapText',
    title: 'Wrap text',
    defaultItem: 'chartStyle:alignLeft',
    items: ['chartStyle:alignLeft', 'chartStyle:alignRight'],
  },
  {
    name: 'chartStyle:breakText',
    title: 'Break text',
    defaultItem: 'chartStyle:block',
    items: [
      'chartStyle:alignBlockLeft',
      'chartStyle:block',
      'chartStyle:alignBlockRight',
    ],
  },
];

export function normalizeDefinition(definition) {
  if (typeof definition === 'string') {
    // Just the name of the style has been passed, but none of the defaults.
    if (!DEFAULT_OPTIONS[definition]) {
      // Normalize the style anyway to prevent errors.
      definition = { name: definition };
    }
    // Just the name of the style has been passed and it's one of the defaults, just use it.
    // Clone the style to avoid overriding defaults.
    else {
      definition = { ...DEFAULT_OPTIONS[definition] };
    }
  } else {
    // If an object style has been passed and if the name matches one of the defaults,
    // extend it with defaults – the user wants to customize a default style.
    // Note: Don't override the user–defined style object, clone it instead.
    definition = extendStyle(DEFAULT_OPTIONS[definition.name], definition);
  }

  // If an icon is defined as a string and correspond with a name
  // in default icons, use the default icon provided by the plugin.
  if (typeof definition.icon === 'string') {
    definition.icon = DEFAULT_ICONS[definition.icon] || definition.icon;
  }

  return definition;
}

export function extendStyle(source, style) {
  const extendedStyle = { ...style };

  for (const prop in source) {
    if (!Object.prototype.hasOwnProperty.call(style, prop)) {
      extendedStyle[prop] = source[prop];
    }
  }

  return extendedStyle;
}

export function normalizeStyles(config) {
  const configuredStyles = config.configuredStyles.options || [];

  const styles = configuredStyles.map((arrangement) =>
    normalizeDefinition(arrangement)
  );

  return styles;
}

export function getDefaultDropdownDefinitions(pluginCollection) {
  if (
    pluginCollection.has('chartEditing') &&
    pluginCollection.has('chartInlineEditing')
  ) {
    return [...DEFAULT_DROPDOWN_DEFINITIONS];
  } else {
    return [];
  }
}

export function warnInvalidStyle(info) {
  logWarning('chart-style-configuration-definition-invalid', info);
}

export function getDefaultStylesConfiguration() {
  return {
    options: [
      'inline',
      'alignLeft',
      'alignRight',
      'alignCenter',
      'alignBlockLeft',
      'alignBlockRight',
      'block',
      'side',
    ],
  };
}
