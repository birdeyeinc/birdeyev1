import React from 'react';
import WorkspaceEmptyState from './WorkspaceEmptyState';

export default {
  title: 'Agent Builder/Modules/FlowCanvas/WorkspaceEmptyState',
  component: WorkspaceEmptyState,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {
    onCreateFromScratch: () => {},
    onUseTemplate: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', background: 'var(--light-grayish-blue)' }}>
        <Story />
      </div>
    ),
  ],
};

export const LibraryOpen = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ height: '100vh', display: 'flex', background: 'var(--light-grayish-blue)' }}>
        <WorkspaceEmptyState
          onCreateFromScratch={() => {}}
          onUseTemplate={() => {}}
          _defaultLibraryOpen={open}
        />
      </div>
    );
  },
};
