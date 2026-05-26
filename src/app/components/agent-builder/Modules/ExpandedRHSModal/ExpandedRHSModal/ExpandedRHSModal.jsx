import React from 'react';
import ExpandedRHSHeader from '../../../Molecules/ExpandedRHS/ExpandedRHSHeader/ExpandedRHSHeader';
import ExpandedRHSFooter from '../../../Molecules/ExpandedRHS/ExpandedRHSFooter/ExpandedRHSFooter';

const font = '"Inter", arial, sans-serif';

const DIVIDER = (
  <div style={{ width: 1, background: 'var(--new-selected-color)', flexShrink: 0 }} />
);

export default function ExpandedRHSModal({
  title = 'Title',
  onCancel,
  onSave,
  onClose,
  showPromptStrength = false,
  promptStrength = 'Weak',
  promptFillWidth = 52,
  formContent,
  testContent,
}) {
  const noop = () => {};
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: 'var(--gray-0)',
      borderRadius: 8,
      fontFamily: font,
      overflow: 'hidden',
    }}>
      <ExpandedRHSHeader
        title={title}
        onClose={onClose || noop}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {formContent}
        </div>
        {DIVIDER}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--gray-10)' }}>
          {testContent}
        </div>
      </div>

      <ExpandedRHSFooter
        onCancel={onCancel || noop}
        onSave={onSave || noop}
        showPromptStrength={showPromptStrength}
        promptStrength={promptStrength}
        promptFillWidth={promptFillWidth}
      />
    </div>
  );
}
