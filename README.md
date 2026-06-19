# CodeSync — Web Client

> A shared room where your whole team codes as one. Live cursors, instant sync, zero conflicts.

CodeSync is a real-time collaborative code editor. Spin up a room, share the link, and edit the same file together — every keystroke, cursor, and selection synced live. Includes a shared notepad for rough work and sandboxed multi-language code execution.

**Live demo:** https://codesync-web-lake.vercel.app

<!-- TODO: add demo GIF here -->
![CodeSync demo](./demo.gif)

---

## Features

- **Real-time collaborative editing** — multiple developers edit the same file simultaneously, powered by Yjs CRDTs (conflict-free merges, no locking).
- **Live cursors & presence** — see every collaborator's cursor, selection, name, and color in real time via Yjs awareness.
- **Multi-language syntax highlighting** — JavaScript/TypeScript, Python, C++, and HTML, with live language switching.
- **Shared notepad** — a second collaborative surface on the same document for notes and pseudocode, independent of the code editor.
- **Code execution** — run code and see shared output in the room (requires a self-hosted engine; see note below).
- **Room passcodes** — optional server-enforced access control per room.
- **Connection status & responsive design** — live connection indicator, works down to mobile widths.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Editor | CodeMirror 6 (`@uiw/react-codemirror`) |
| Real-time sync | Yjs (CRDT) + `y-websocket` + `y-codemirror.next` |
| Styling | Tailwind CSS, shadcn/ui |
| Room IDs | nanoid |
| Hosting | Vercel |

---

## How It Works

CodeSync uses **Yjs**, a CRDT (Conflict-free Replicated Data Type) library. Each character has a unique, ordered identity, so concurrent edits from different users merge deterministically — no conflicts, no locking, no "who wins" decisions.

- **Document sync** travels over a WebSocket connection to the backend server, which relays binary update deltas between clients and persists the document.
- **Presence** (cursors, names, colors) rides on Yjs *awareness* — a separate ephemeral channel that isn't saved with the document.
- **Multiple surfaces** — the code editor and the notepad are two independent named texts (`getText('codemirror')` and `getText('notepad')`) on a single shared Yjs document, sharing one WebSocket connection.
- **Shared execution output** is written to a third shared field (`getText('output')`), so when one user runs code, the result appears for everyone in the room.

CRDTs guarantee the document *converges* to the same state everywhere — they do not guarantee the merged code is semantically correct, which is the natural behavior of any collaborative editor.

---

## Local Setup

```bash
git clone https://github.com/Maruthi14-gif/codesync-web.git
cd codesync-web
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_WS_URL=ws://localhost:1234
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000. You'll also need the backend running — see [codesync-server](https://github.com/Maruthi14-gif/codesync-server).

---

## A Note on Code Execution

Code execution is powered by a **self-hosted [Piston](https://github.com/engineer-man/piston) engine** running in Docker, which sandboxes untrusted code using Isolate (Linux namespaces, cgroups, privileged operations).

Because Piston's sandboxing requires a writable filesystem and privileged container operations, it **cannot run on managed hosting platforms** (like Railway/Vercel) that enforce read-only, unprivileged containers. The deployed demo therefore runs **collaboration only** — when you click Run on the live site, you'll see a friendly notice.

To use code execution, run Piston locally (see the [codesync-server README](https://github.com/Maruthi14-gif/codesync-server)) and the feature works fully — multi-language compile and run, with output shared live across the room.

---

## Related

- Backend: [codesync-server](https://github.com/Maruthi14-gif/codesync-server)
