# JSON explorer

JSON Explorer is a React application that allows users to explore and interact with JSON data in a user-friendly way. It provides features like viewing and navigating JSON structures, copying JSON data to the clipboard, and more.

Built Bun and Vite, using [this](https://bun.sh/guides/ecosystem/vite) for the boilerplate

### Prerequisites

- [Bun.sh](https://bun.sh/docs/installation) installed on your machine.

## Getting Started

- Install [Bun](https://bun.sh/docs/installation)
- Clone the main repository
- Navigate from you terminal to /explorer
- Execute the command `bun install`
- Execute the command `bun run dev`  
- The application will be available at http://localhost:5173 in your web browser.

## Features
- Upload JSON data files.
- Explore and navigate JSON structures.
- Indentation and formatting for easy readability.
- Highlighting of keys for interaction.
- Display of key paths and values on click.
- Copying the whole JSON or a subsection made easy.
- Copying and pasting in your IDE should be a valid formatted json.

## Usage
1. Upload JSON Data:
- Click the "Upload JSON" button in the header.
- Select a JSON file from your local machine.
- The JSON data will be loaded and displayed on the left side of the application.

2. Explore JSON Data:
- Click on keys to navigate through the JSON structure.
- Keys are highlighted for interaction.

3. Copy to Clipboard:
- Click the "Copy to Clipboard" button to copy the displayed JSON data.
- The copied JSON data can be pasted into your preferred IDE, text editor or wherever.

4. Key Path and Value:
- Click on a key to display its key path and value on the right side of the application.