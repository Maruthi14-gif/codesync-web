import * as Y from 'yjs';

export function bindTextarea(textarea: HTMLTextAreaElement, ytext: Y.Text) {
  // 1. Initialize value from remote text
  textarea.value = ytext.toString();

  let isUpdating = false;

  // Listen to remote changes on Y.Text
  const observer = (event: Y.YTextEvent) => {
    if (isUpdating) return;

    // Store cursor position and total content length before modifying DOM value
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textLength = textarea.value.length;

    isUpdating = true;
    textarea.value = ytext.toString();
    isUpdating = false;

    // Recalculate cursor offsets based on remote edits
    const newLength = textarea.value.length;
    const diff = newLength - textLength;
    const newStart = start + (start >= textarea.selectionStart ? diff : 0);
    const newEnd = end + (end >= textarea.selectionEnd ? diff : 0);
    textarea.setSelectionRange(newStart, newEnd);
  };

  ytext.observe(observer);

  // Listen to local changes on textarea input
  const inputHandler = () => {
    if (isUpdating) return;

    isUpdating = true;
    const localVal = textarea.value;
    const remoteVal = ytext.toString();

    if (localVal !== remoteVal) {
      // Find common prefix length
      let start = 0;
      while (start < localVal.length && start < remoteVal.length && localVal[start] === remoteVal[start]) {
        start++;
      }

      // Find common suffix length
      let endLocal = localVal.length - 1;
      let endRemote = remoteVal.length - 1;
      while (endLocal >= start && endRemote >= start && localVal[endLocal] === remoteVal[endRemote]) {
        endLocal--;
        endRemote--;
      }

      const deleteCount = endRemote - start + 1;
      const insertText = localVal.slice(start, endLocal + 1);

      ytext.doc?.transact(() => {
        if (deleteCount > 0) {
          ytext.delete(start, deleteCount);
        }
        if (insertText.length > 0) {
          ytext.insert(start, insertText);
        }
      });
    }
    isUpdating = false;
  };

  textarea.addEventListener('input', inputHandler);

  // Return unsubscribe cleanup handler
  return () => {
    ytext.unobserve(observer);
    textarea.removeEventListener('input', inputHandler);
  };
}
