# codesync-web

> A beautiful, premium real-time collaborative code editor and scratchpad.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js (App Router, TS)** | Modern frontend framework with server-side rendering support |
| **Tailwind CSS + shadcn/ui** | Responsive styling and curated design components |
| **CodeMirror 6** | Extensible text editor for code syntax and highlighting |
| **@uiw/react-codemirror** | React wrapper component for CodeMirror 6 |
| **Yjs** | CRDT library managing shared document data |
| **y-websocket** | WebSocket provider binding Yjs to the sync server |
| **Lucide React** | Sleek icon pack |

---

## Local Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create `.env.local` based on the example:
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build Production Bundle:**
   ```bash
   npm run build
   ```

---

## Environment Variables

| Variable | Description | Example | Required |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL of the collaborative sync server. | `ws://localhost:1234` | Yes |

---

## How It Works

### Yjs CRDT Sync
The application uses Yjs, a high-performance Conflict-free Replicated Data Type (CRDT) library, to enable concurrent document edits without conflicts. Edits made locally inside CodeMirror are translated to Yjs updates and sent to other clients over WebSockets. The system merges changes automatically, ensuring eventual consistency.

### Awareness-based Presence
Collaborator cursors, selection highlights, and user names are powered by Yjs's **Awareness** protocol. Unlike document edits, awareness data is temporary, state-driven, and is not stored in the database. When users move their cursors or disconnect, their presence updates are broadcasted to all active peers, drawing live remote carets.

### Multi-surface Document Structure
A single `Y.Doc` serves as the shared data model for each workspace room, holding two independent, top-level `Y.Text` surfaces:
- **Code Editor:** Bound to the CodeMirror 6 text editor.
- **Scratchpad:** Bound to a regular HTML `textarea` element for brainstorms and scratch notes using a custom binding wrapper.

Since both surfaces belong to the same document, they sync over the same connection and remain separate independent surfaces.

---

## Demo & Live URL

- **Live URL:** *[Insert Live URL Here]*
- **Demo Preview:**  
  ![Demo GIF Placeholder](https://via.placeholder.com/800x450.gif?text=Demo+GIF+Placeholder)
