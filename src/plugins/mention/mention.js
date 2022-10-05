import { Plugin } from '@ckeditor/ckeditor5-core';

import { _toMentionAttribute, MentionEditing } from './mention-editing';
import { MentionUI } from './mention-ui';

import './theme/mention.css';

export class Mention extends Plugin {
  /**
   * Creates a mention attribute value from the provided view element and optional data.
   *
   *		editor.plugins.get( 'Mention' ).toMentionAttribute( viewElement, { userId: '1234' } );
   *
   *		// For a view element: <span data-mention="@joe">@John Doe</span>
   *		// it will return:
   *		// { id: '@joe', userId: '1234', uid: '7a7bc7...', _text: '@John Doe' }
   *
   * @param {module:engine/view/element~Element} viewElement
   * @param {String|Object} [data] Additional data to be stored in the mention attribute.
   * @returns {module:mention/mention~MentionAttribute}
   */
  toMentionAttribute(viewElement, data) {
    return _toMentionAttribute(viewElement, data);
  }

  static get pluginName() {
    return 'Mention';
  }

  static get requires() {
    return [MentionEditing, MentionUI];
  }
}
