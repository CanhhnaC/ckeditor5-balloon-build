import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';

class Editor extends BalloonEditor {}

Editor.builtinPlugins = [Paragraph, Essentials, Bold];

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: ['bold', '|', 'undo', 'redo'],
  },
  language: 'en',
};

export default Editor;
