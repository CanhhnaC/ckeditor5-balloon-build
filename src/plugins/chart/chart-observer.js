import { Observer } from '@ckeditor/ckeditor5-engine';

export class ChartObserver extends Observer {
  observe(domRoot) {
    setTimeout(() => {
      domRoot.querySelectorAll('.chart').forEach((domEvent) => {
        this._fireEvents(domEvent);
      });
    });
  }

  _fireEvents(domEvent) {
    if (this.isEnabled) {
      this.document.fire('layoutChanged');
      this.document.fire('chartLoaded', domEvent);
    }
  }
}
