import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import RichTextEditorWrapper from './index';
import { RichTextEditorProps } from './RichTextEditor';
import { CustomRichTextEditorProps, CustomToolbarOption } from './interface';
import { gray0, blue10, yellow10, green10, red10, gray600, green100, red100, gray90, blue100 } from 'sass/js/colors';

const meta: Meta<typeof RichTextEditorWrapper> = {
  title: 'Atom/RichTextEditor',
  component: RichTextEditorWrapper,
  args: {
    value: '',
    defaultValue: '',
    placeholder: 'Type here...',
    readOnly: false,
    theme: 'snow',
    modules: {},
    formats: undefined,
    bounds: undefined,
    tabIndex: undefined,
    className: '',
    style: {},
    preserveWhitespace: false,
    children: undefined,
    registry: undefined // Add registry prop for Quill 2.0 support
  },
  argTypes: {
    value: { control: 'text', description: 'Controlled value (HTML or Delta)' },
    defaultValue: { control: 'text', description: 'Initial value (uncontrolled)' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    readOnly: { control: 'boolean', description: 'Read-only mode' },
    theme: { control: 'text', description: 'Quill theme', defaultValue: 'snow' },
    modules: { control: 'object', description: 'Quill modules config' },
    formats: { control: 'object', description: 'Allowed formats' },
    bounds: { control: 'text', description: 'Quill bounds selector' },
    tabIndex: { control: 'number', description: 'Tab index' },
    className: { control: 'text', description: 'Custom className' },
    style: { control: 'object', description: 'Custom style' },
    preserveWhitespace: { control: 'boolean', description: 'Render editing area as <pre>' },
    children: { control: false, description: 'Custom editing area (React element)' },
    registry: { control: false, description: 'Quill registry for multiple editor support' }, // Add registry to argTypes
    onChange: { action: 'onChange', description: 'Change event handler' },
    onChangeSelection: { action: 'onChangeSelection', description: 'Selection change handler' },
    onFocus: { action: 'onFocus', description: 'Focus event handler' },
    onBlur: { action: 'onBlur', description: 'Blur event handler' },
    onKeyPress: { action: 'onKeyPress', description: 'Key press event handler' },
    onKeyDown: { action: 'onKeyDown', description: 'Key down event handler' },
    onKeyUp: { action: 'onKeyUp', description: 'Key up event handler' }
  },
  parameters: {
    docs: {
      description: {
        component: 'A fully controlled or uncontrolled rich text editor based on Quill.'
      }
    }
  }
};
export default meta;

const Template: StoryFn<RichTextEditorProps & { autoFocus?: boolean }> = (args) => {
  const editorRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (args.autoFocus && editorRef.current && editorRef.current.focus) {
      editorRef.current.focus();
    }
  }, [args.autoFocus]);

  return <RichTextEditorWrapper {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: '<p>Hello, <strong>world!</strong></p>',
  placeholder: 'Type here...'
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  value: '<p>This is read-only.</p>',
  readOnly: true
};

export const WithModules = Template.bind({});
WithModules.args = {
  value: '<p>Custom toolbar</p>',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image']
    ]
  }
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  value: '',
  placeholder: 'Start typing your story...'
};

export const PreserveWhitespace = Template.bind({});
PreserveWhitespace.args = {
  value: '    Indented\n    Text',
  preserveWhitespace: true
};

export const WithRef = Template.bind({});
WithRef.args = {
  value: '<p>Editor with ref. Focused on mount if autoFocus is true.</p>',
  autoFocus: true
};

export const ScrollTest = Template.bind({});
ScrollTest.args = {
  value: '<p>' + 'Line<br>'.repeat(50) + '</p>',
  style: { height: 200, overflow: 'auto', border: '1px solid #eee' },
  placeholder: 'Scroll inside this container...'
};

export const CustomRichTextEditor: StoryFn<CustomRichTextEditorProps> = (args) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const editorRef = React.useRef<any>(null);

  const insertEmoji = (emoji: string) => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      if (editor) {
        const selection = editor.getSelection();
        const cursorPosition = selection ? selection.index : editor.getLength();
        editor.insertText(cursorPosition, emoji);
        editor.setSelection(cursorPosition + emoji.length);
      }
    }
    setShowEmojiPicker(false);
  };

  const customToolbarOptions: CustomToolbarOption[] = [
    {
      id: 'emoji-picker',
      render: () => (
        <div style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
          <button
            type="button"
            style={{
              height: '28px',
              padding: '0 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: showEmojiPicker ? '#e0e0e0' : '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '2px',
            }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                {['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💡'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    style={{ padding: '5px', fontSize: '18px', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'link-inserter',
      render: () => (
        <div style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
          <button
            type="button"
            style={{
              height: '28px',
              padding: '0 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: showLinkInput ? '#e0e0e0' : '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '2px',
            }}
            onClick={() => setShowLinkInput(!showLinkInput)}
          >
            🔗
          </button>
          {showLinkInput && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '10px', minWidth: '250px' }}>
                <input
                  type="text"
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  style={{ width: '100%', padding: '5px', marginBottom: '5px', boxSizing: 'border-box' }}
                />
                <button
                  onClick={() => {
                    console.log('Insert link:', linkUrl);
                    setLinkUrl('');
                    setShowLinkInput(false);
                  }}
                  style={{ width: '100%', padding: '5px', cursor: 'pointer' }}
                >
                  Insert Link
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'custom-action',
      render: () => (
        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <button
            type="button"
            style={{
              height: '28px',
              padding: '0 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '2px',
            }}
            onClick={() => alert('Custom action triggered!')}
          >
            ⭐
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "50px" }}>
      <RichTextEditorWrapper
        ref={editorRef}
        placeholder={'Custom editor with extensible toolbar options.'}
        backgroundColorConfig={[
          { label: 'White', value: gray0 },
          { label: 'Blue', value: blue10 },
          { label: 'Yellow', value: yellow10 },
          { label: 'Green', value: green10 },
          { label: 'Red', value: red10 },
          { label: "None", value: red100 }
        ]}
        textColorConfig={[
          { label: "Gray", value: gray600 },
          { label: "Green", value: green100 },
          { label: "Red", value: red100 },
          { label: "Dark gray", value: gray90 },
          { label: "Blue", value: blue100 }
        ]}
        showTransparentInColorPicker
        isCustom={true}
        customToolbarOptions={customToolbarOptions}
        style={{ height: '120px' }}
        showCustomJSXInEditor
        renderCustomJSXInEditor={() => {
          return (
            <div>
              <span
                onClick={() => { }}
              >
                <i className="icon_phoenix-check" />
              </span>
              <span
                onClick={() => { }}
              >
                <i className="icon_phoenix-close" />
              </span>
            </div>
          )
        }}
      />
    </div>
  );
};