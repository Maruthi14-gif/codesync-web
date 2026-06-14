import * as cmView from '@codemirror/view';
import * as cmState from '@codemirror/state';
import * as Y from 'yjs';
import {
  yCollab as originalYCollab,
  yRemoteSelections as originalYRemoteSelections,
  yRemoteSelectionsTheme as originalYRemoteSelectionsTheme,
  ySync as originalYSync,
  ySyncFacet
} from 'y-codemirror.next';
// @ts-ignore
import { ySyncAnnotation } from '../node_modules/y-codemirror.next/src/y-sync.js';

const yRemoteSelectionsAnnotation = cmState.Annotation.define<any>();

class YRemoteCaretWidget extends cmView.WidgetType {
  color: string;
  name: string;

  constructor(color: string, name: string) {
    super();
    this.color = color;
    this.name = name;
  }

  toDOM() {
    const caret = document.createElement('span');
    caret.className = 'cm-ySelectionCaret';
    caret.style.backgroundColor = this.color;
    caret.style.borderColor = this.color;

    const dot = document.createElement('div');
    dot.className = 'cm-ySelectionCaretDot';

    const info = document.createElement('div');
    info.className = 'cm-ySelectionInfo';
    info.textContent = this.name;

    caret.appendChild(document.createTextNode('\u2060'));
    caret.appendChild(dot);
    caret.appendChild(document.createTextNode('\u2060'));
    caret.appendChild(info);
    caret.appendChild(document.createTextNode('\u2060'));

    return caret;
  }

  eq(widget: YRemoteCaretWidget) {
    return widget.color === this.color;
  }

  compare(widget: YRemoteCaretWidget) {
    return widget.color === this.color;
  }

  updateDOM() {
    return false;
  }

  get estimatedHeight() {
    return -1;
  }

  ignoreEvent() {
    return true;
  }
}

class YRemoteSelectionsPluginValue {
  conf: any;
  _listener: any;
  _awareness: any;
  decorations: cmView.DecorationSet;

  constructor(view: cmView.EditorView) {
    this.conf = view.state.facet(ySyncFacet);
    this._listener = ({ added, updated, removed }: any) => {
      const clients = added.concat(updated).concat(removed);
      if (clients.findIndex((id: number) => id !== this.conf.awareness.doc.clientID) >= 0) {
        view.dispatch({ annotations: [yRemoteSelectionsAnnotation.of([])] });
      }
    };
    this._awareness = this.conf.awareness;
    this._awareness.on('change', this._listener);
    this.decorations = cmState.RangeSet.of([]);
  }

  destroy() {
    this._awareness.off('change', this._listener);
  }

  update(update: cmView.ViewUpdate) {
    const ytext = this.conf.ytext;
    const ydoc = ytext.doc;
    const awareness = this.conf.awareness;
    const decorations: any[] = [];
    const localAwarenessState = this.conf.awareness.getLocalState();

    // Set local awareness state (update cursors)
    if (localAwarenessState != null) {
      const hasFocus = update.view.hasFocus && update.view.dom.ownerDocument.hasFocus();
      const sel = hasFocus ? update.state.selection.main : null;
      const currentAnchor = localAwarenessState.cursor == null ? null : Y.createRelativePositionFromJSON(localAwarenessState.cursor.anchor);
      const currentHead = localAwarenessState.cursor == null ? null : Y.createRelativePositionFromJSON(localAwarenessState.cursor.head);

      if (sel != null) {
        const anchor = Y.createRelativePositionFromTypeIndex(ytext, sel.anchor);
        const head = Y.createRelativePositionFromTypeIndex(ytext, sel.head);
        if (localAwarenessState.cursor == null || !Y.compareRelativePositions(currentAnchor, anchor) || !Y.compareRelativePositions(currentHead, head)) {
          awareness.setLocalStateField('cursor', {
            anchor,
            head
          });
        }
      } else if (localAwarenessState.cursor != null && hasFocus) {
        awareness.setLocalStateField('cursor', null);
      }
    }

    // Update decorations (remote selections)
    const docLength = update.view.state.doc.length;
    awareness.getStates().forEach((state: any, clientid: number) => {
      if (clientid === awareness.doc.clientID) {
        return;
      }
      const cursor = state.cursor;
      if (cursor == null || cursor.anchor == null || cursor.head == null) {
        return;
      }
      const anchor = Y.createAbsolutePositionFromRelativePosition(cursor.anchor, ydoc);
      const head = Y.createAbsolutePositionFromRelativePosition(cursor.head, ydoc);
      if (anchor == null || head == null || anchor.type !== ytext || head.type !== ytext) {
        return;
      }

      // CRITICAL BUGFIX: Ensure selection indices are within bounds of the current editor document.
      // During initial sync or rapid edits, the local editor document might temporarily be shorter
      // than the remote selection state. We skip drawing these out-of-bound ranges to prevent RangeError.
      if (anchor.index > docLength || head.index > docLength) {
        return;
      }

      const { color = '#30bced', name = 'Anonymous' } = state.user || {};
      const colorLight = (state.user && state.user.colorLight) || color + '33';
      const start = Math.min(anchor.index, head.index);
      const end = Math.max(anchor.index, head.index);
      
      const startLine = update.view.state.doc.lineAt(start);
      const endLine = update.view.state.doc.lineAt(end);
      if (startLine.number === endLine.number) {
        // Selected content in a single line
        decorations.push({
          from: start,
          to: end,
          value: cmView.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: 'cm-ySelection'
          })
        });
      } else {
        // Selected content in multiple lines
        // First, render text-selection in the first line
        decorations.push({
          from: start,
          to: startLine.from + startLine.length,
          value: cmView.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: 'cm-ySelection'
          })
        });
        // Render text-selection in the last line
        decorations.push({
          from: endLine.from,
          to: end,
          value: cmView.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: 'cm-ySelection'
          })
        });
        for (let i = startLine.number + 1; i < endLine.number; i++) {
          const linePos = update.view.state.doc.line(i).from;
          decorations.push({
            from: linePos,
            to: linePos,
            value: cmView.Decoration.line({
              attributes: { style: `background-color: ${colorLight}`, class: 'cm-yLineSelection' }
            })
          });
        }
      }
      decorations.push({
        from: head.index,
        to: head.index,
        value: cmView.Decoration.widget({
          side: head.index - anchor.index > 0 ? -1 : 1, // Render remote caret outside the selection range
          block: false,
          widget: new YRemoteCaretWidget(color, name)
        })
      });
    });
    this.decorations = cmView.Decoration.set(decorations, true);
  }
}

class SafeYSyncPluginValue {
  view: cmView.EditorView;
  conf: any;
  _observer: (event: any, tr: any) => void;
  _ytext: Y.Text;

  constructor(view: cmView.EditorView) {
    this.view = view;
    this.conf = view.state.facet(ySyncFacet);
    this._observer = (event: any, tr: any) => {
      if (tr.origin !== this.conf) {
        const delta = event.delta;
        const changes: any[] = [];
        let pos = 0;
        for (let i = 0; i < delta.length; i++) {
          const d = delta[i];
          if (d.insert != null) {
            changes.push({ from: pos, to: pos, insert: d.insert });
          } else if (d.delete != null) {
            changes.push({ from: pos, to: pos + d.delete, insert: '' });
            pos += d.delete;
          } else {
            pos += d.retain;
          }
        }
        view.dispatch({ changes, annotations: [ySyncAnnotation.of(this.conf)] });
      }
    };
    this._ytext = this.conf.ytext;
    this._ytext.observe(this._observer);

    // CRITICAL BUGFIX: Initial synchronization fallback.
    // If the Yjs text already has synced content but the CodeMirror document is empty or differs,
    // dispatch a transaction to populate/sync it. We defer this to the next microtask
    // to avoid dispatching during CodeMirror's active view-update initialization phase.
    const ytextVal = this._ytext.toString();
    const docVal = view.state.doc.toString();
    if (docVal !== ytextVal) {
      Promise.resolve().then(() => {
        if ((view as any).destroyed) return;
        if (view.state.doc.toString() !== ytextVal) {
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: ytextVal },
            annotations: [ySyncAnnotation.of(this.conf)]
          });
        }
      });
    }
  }

  update(update: cmView.ViewUpdate) {
    if (!update.docChanged || (update.transactions.length > 0 && update.transactions[0].annotation(ySyncAnnotation) === this.conf)) {
      return;
    }
    const ytext = this.conf.ytext;
    ytext.doc.transact(() => {
      let adj = 0;
      update.changes.iterChanges((fromA, toA, fromB, toB, insert) => {
        const insertText = insert.sliceString(0, insert.length, '\n');
        if (fromA !== toA) {
          ytext.delete(fromA + adj, toA - fromA);
        }
        if (insertText.length > 0) {
          ytext.insert(fromA + adj, insertText);
        }
        adj += insertText.length - (toA - fromA);
      });
    }, this.conf);
  }

  destroy() {
    this._ytext.unobserve(this._observer);
  }
}

export const safeYSync = cmView.ViewPlugin.fromClass(SafeYSyncPluginValue);

export const safeYRemoteSelections = cmView.ViewPlugin.fromClass(YRemoteSelectionsPluginValue, {
  decorations: v => v.decorations
});

export const safeYRemoteSelectionsTheme = originalYRemoteSelectionsTheme;

export const safeYCollab = (ytext: Y.Text, awareness: any, opts?: any) => {
  const plugins = originalYCollab(ytext, awareness, opts) as any[];
  return plugins.map(plugin => {
    if (plugin === originalYSync) {
      return safeYSync;
    }
    if (plugin === originalYRemoteSelections) {
      return safeYRemoteSelections;
    }
    if (plugin === originalYRemoteSelectionsTheme) {
      return safeYRemoteSelectionsTheme;
    }
    return plugin;
  });
};
