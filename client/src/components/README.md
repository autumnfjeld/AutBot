# Components

This directory contains all the React components for the AutBot application, organized following React best practices.

## Component Structure

### `Header.jsx`
- Displays the app title, logo, and description
- Contains the clickable logo that links to autumnfjeld.com
- Pure presentational component with no state

### `QueryForm.jsx`
- Handles user input and form submission
- Manages its own input state
- Receives `onSubmit` callback and `isLoading` prop from parent
- Accepts `externalInputValue` prop to set input from sample prompts
- Clears input after successful submission

### `SamplePrompts.jsx`
- Displays clickable example questions to help users get started
- Contains four curated sample prompts about Autumn
- Receives `onPromptClick` callback and `isLoading` prop from parent
- Matches app styling with hover effects and disabled states
- Pure presentational component with no internal state

### `StructuredResponse.jsx`
- Displays structured JSON responses with summary, details, and fun facts sections
- Parses JSON responses and falls back to plain text if parsing fails
- Uses distinct styling for each section (sky blue for summary, stone for details, lime for fun facts)
- Includes icons and proper typography for better readability
- Handles error states and empty responses gracefully

### `ResponseDisplay.jsx`
- Shows API responses and error messages
- Conditionally renders based on error/response state
- Pure presentational component

### `Footer.jsx`
- Contains all footer links and copyright information
- Pure presentational component with no state

## Usage

Components are exported through `index.js` for clean imports:

```jsx
import { Header, QueryForm, StructuredResponse, Footer, SamplePrompts } from './components'
```

## Design Principles

- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Components are composed together in App.jsx
- **Props Down, Events Up**: Data flows down via props, events bubble up via callbacks
- **Separation of Concerns**: UI logic is separated from business logic (which lives in hooks) 