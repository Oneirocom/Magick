// GENERATED 
/**
 * @file This TypeScript module provides the entry point for the MagickIDE, and sets up the React rendering of the component.
 * @version 1.0.0
 */

import { createRoot } from 'react-dom/client';
import { MagickIDE, AppConfig } from '@magickml/editor';
import { DEFAULT_PROJECT_ID, API_ROOT_URL } from '@magickml/engine';

/**
 * Entry point for the MagickIDE application.
 * If loaded as a standalone window, sets up the rendering and checks for parameters.
 * If loaded inside an iframe, listens for messages from the parent to validate the origin source and initializes the IDE.
 *
 * @function
 * @returns Void
 */
const initializeMagickIDE = (): void => {
  // If the editor is loaded in its own window
  if (window === window.parent) {
    const container = document.getElementById('root');
    const root = createRoot(container); // createRoot(container!) if you use TypeScript

    // Debugging accessibility
    (window as any).root = root;

    // Check URL parameters for projectId and apiUrl
    const projectId =
      new URLSearchParams(window.location.search).get('projectId') ??
      DEFAULT_PROJECT_ID;

    const apiUrl =
      new URLSearchParams(window.location.search).get('apiUrl') ??
      API_ROOT_URL ??
      'http://localhost:3030';

    const config: AppConfig = {
      apiUrl,
      projectId,
      token: '',
    };

    const Root = () => <MagickIDE config={config} />;

    // Render the root element
    root.render(<Root />);
  
  // If the editor is loaded inside an iframe
  } else {
    // Listen for messages from the parent
    window.addEventListener(
      'message',
      event => {
        const cloudUrlRaw =
          import.meta.env.VITE_APP_TRUSTED_PARENT_URL || 'http://localhost:3000';

        // Remove possible trailing slashes from the URL
        const cloudUrl = cloudUrlRaw.replace(/\/+$/, '');

        // Check the iframe source to ensure it is trusted
        if (
          event.source !== window &&
          event.origin !== window.location.origin &&
          event.origin !== cloudUrl
        ) {
          console.warn('untrusted origin', event.origin);
          console.warn('EXITING');
          return;
        }

        const { data } = event;
        const { type, payload } = data;

        // Check the message type
        if (type === 'INIT') {
          // To do - store configuration settings in local storage

          const { config } = payload;

          const Root = () => <MagickIDE config={config} />;
          const container = document.getElementById('root');
          const root = createRoot(container); // createRoot(container!) if you use TypeScript

          // Debugging accessibility
          (window as any).root = root;

          // Render the root element
          root.render(<Root />);
        }
      },
      false
    );
  }
};

// Call the initialization function to start the application.
initializeMagickIDE();