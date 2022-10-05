import { ListItemView } from '@ckeditor/ckeditor5-ui';

export class MentionListItemView extends ListItemView {
  highlight() {
    const child = this.children.first;

    child.isOn = true;
  }

  removeHighlight() {
    const child = this.children.first;

    child.isOn = false;
  }
}
