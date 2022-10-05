import { toMap } from '@ckeditor/ckeditor5-utils';
import TableWalker from '@ckeditor/ckeditor5-table/src/tablewalker';

function generateChart({ mention, model, range, writer }) {
  Object.assign(mention.attributes, {
    'chart-config': JSON.stringify(mention.attributes['chart-config']),
  });

  model.insertContent(writer.createElement('chart', mention.attributes), range);
}

function generateText({
  selection,
  model,
  writer,
  range,
  mention,
  mentionText,
}) {
  const currentAttributes = toMap(selection.getAttributes());
  const attributesWithMention = new Map(currentAttributes.entries());

  attributesWithMention.set('mention', mention);

  // Replace a range with the text with a mention.
  model.insertContent(
    writer.createText(mentionText, attributesWithMention),
    range
  );
  model.insertContent(
    writer.createText(' ', currentAttributes),
    range.start.getShiftedBy(mentionText.length)
  );
}

function generateTable({ plugins, mention, writer, model, range }) {
  const tableUtils = plugins.get('TableUtils');
  const { rows, columns, content } = mention;

  const table = tableUtils.createTable(writer, { rows, columns });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = table.getChild(r).getChild(c);
      const paragraph = cell.getChild(0);

      const index = r * columns + c;
      const value = content[index];

      if (value.hasOwnProperty('style')) {
        const { style } = value;
        for (let attribute in style) {
          writer.setAttribute(attribute, style[attribute], cell);
        }
      }

      if (value.hasOwnProperty('content')) {
        writer.insertText(value.content, paragraph, 0);
      }
    }
  }

  model.insertContent(table, range);
}

const generate = {
  chart: generateChart,
  text: generateText,
  table: generateTable,
};

export function generateMention(name, props) {
  return generate[name](props);
}

export function generateDataOfTable(table, rows) {
  const tableIterator = new TableWalker(table, { endRow: rows });
  return [...tableIterator].map(({ cell }) => ({
    content: cell.getChild(0).getChild(0).data,
    style: [...cell.getAttributes()],
  }));
}
