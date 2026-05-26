// Export the main component
export { default } from './index.jsx'

// Export context and hook for external use
export { CopilotProvider, useCopilot } from './context/CopilotContext.jsx'

// Export individual components if needed
export { default as CopilotHeader } from './components/CopilotHeader.jsx'
export { default as CopilotBody } from './components/CopilotBody.jsx'
export { default as CopilotFooter } from './components/CopilotFooter.jsx'

// Export toggle and portal components
export { default as ToggleCopilot } from './components/ToggleCopilot.jsx'
export { default as CopilotPortal } from './components/CopilotPortal.jsx'
