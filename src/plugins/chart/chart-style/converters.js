export function modelToViewStyleAttribute(styles) {
  return (evt, data, conversionApi) => {
    if (!conversionApi.consumable.consume(data.item, evt.name)) {
      return;
    }

    // Check if there is class name associated with given value.
    const newStyle = getStyleDefinitionByName(data.attributeNewValue, styles);
    const oldStyle = getStyleDefinitionByName(data.attributeOldValue, styles);

    const viewElement = conversionApi.mapper.toViewElement(data.item);
    const viewWriter = conversionApi.writer;

    if (oldStyle) {
      viewWriter.removeClass(oldStyle.className, viewElement);
    }

    if (newStyle) {
      viewWriter.addClass(newStyle.className, viewElement);
    }
  };
}

export function viewToModelStyleAttribute(styles) {
  // Convert only non–default styles.
  const nonDefaultStyles = {
    chart: styles.filter(
      (style) => !style.isDefault && style.modelElements.includes('chart')
    ),
  };

  return (evt, data, conversionApi) => {
    if (!data.modelRange) {
      return;
    }

    const viewElement = data.viewItem;
    const modelChartElement = first(data.modelRange.getItems());

    // Run this converter only if an chart has been found in the model.
    // In some cases it may not be found (for example if we run this on a figure with different type than chart).
    if (!modelChartElement) {
      return;
    }

    // ...and the `chartStyle` attribute is allowed for that element, otherwise stop conversion early.
    if (!conversionApi.schema.checkAttribute(modelChartElement, 'chartStyle')) {
      return;
    }

    // Convert styles one by one.
    for (const style of nonDefaultStyles[modelChartElement.name]) {
      // Try to consume class corresponding with the style.
      if (
        conversionApi.consumable.consume(viewElement, {
          classes: style.className,
        })
      ) {
        // And convert this style to model attribute.
        conversionApi.writer.setAttribute(
          'chartStyle',
          style.name,
          modelChartElement
        );
      }
    }
  };
}

function getStyleDefinitionByName(name, styles) {
  for (const style of styles) {
    if (style.name === name) {
      return style;
    }
  }
}
