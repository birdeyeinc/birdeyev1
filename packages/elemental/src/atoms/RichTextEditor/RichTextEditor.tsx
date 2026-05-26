/*
React-Quill (TSX version)
https://github.com/zenoamaro/react-quill
*/

import React, { ReactNode } from 'react';
import isEqual from 'lodash/isEqual';
import Quill, { QuillOptions, Delta, Range } from 'quill';
import 'quill/dist/quill.snow.css';
import './RichTextEditor.module.scss';
import styles from './RichTextEditor.module.scss';

export interface RichTextEditorProps {
  value?: string | Delta;
  defaultValue?: string | Delta;
  placeholder?: string;
  readOnly?: boolean;
  theme?: string;
  modules?: QuillOptions['modules'];
  formats?: string[];
  bounds?: string | HTMLElement;
  tabIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  preserveWhitespace?: boolean;
  children?: ReactNode;
  id?: string;
  registry?: any; // Quill 2.0 registry support
  onChange?: (
    value: string,
    delta: Delta,
    source: string,
    editor: any
  ) => void;
  onChangeSelection?: (
    range: Range | null,
    source: string,
    editor: any
  ) => void;
  onFocus?: (
    range: Range | null,
    source: string,
    editor: any
  ) => void;
  onBlur?: (
    previousRange: Range | null,
    source: string,
    editor: any
  ) => void;
  onKeyPress?: React.KeyboardEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
}

interface RichTextEditorState {
  generation: number;
}

class RichTextEditor extends React.Component<RichTextEditorProps, RichTextEditorState> {
  static displayName = 'RichTextEditor';
  static Quill = Quill;
  dirtyProps = ['modules', 'formats', 'bounds', 'theme', 'children'];
  cleanProps = [
    'id',
    'className',
    'style',
    'placeholder',
    'tabIndex',
    'onChange',
    'onChangeSelection',
    'onFocus',
    'onBlur',
    'onKeyPress',
    'onKeyDown',
    'onKeyUp',
  ];
  static defaultProps = {
    theme: 'snow',
    modules: {},
    readOnly: false,
  };
  editor: Quill | null = null;
  editingArea: HTMLElement | null = null;
  value: string | Delta = '';
  selection: Range | null = null;
  lastDeltaChangeSet: Delta | null = null;
  regenerationSnapshot: { delta: Delta; selection: Range | null } | undefined;
  unprivilegedEditor: any = null;

  constructor(props: RichTextEditorProps) {
    super(props);
    const value = this.isControlled() ? props.value : props.defaultValue;
    this.value = value ?? '';
    this.state = { generation: 0 };
  }

  validateProps(props: RichTextEditorProps) {
    if (React.Children.count(props.children) > 1) {
      throw new Error(
        'The Quill editing area can only be composed of a single React element.'
      );
    }
    if (React.Children.count(props.children)) {
      const child = React.Children.only(props.children);
      if ((child as React.ReactElement)?.type === 'textarea') {
        throw new Error(
          'Quill does not support editing on a <textarea>. Use a <div> instead.'
        );
      }
    }
    if (this.lastDeltaChangeSet && props.value === this.lastDeltaChangeSet) {
      throw new Error(
        'You are passing the `delta` object from the `onChange` event back ' +
          'as `value`. You most probably want `editor.getContents()` instead. ' +
          'See: https://github.com/zenoamaro/react-quill#using-deltas'
      );
    }
  }

  shouldComponentUpdate(nextProps: RichTextEditorProps, nextState: RichTextEditorState) {
    this.validateProps(nextProps);
    if (!this.editor || this.state.generation !== nextState.generation) {
      return true;
    }
    if ('value' in nextProps) {
      const prevContents = this.getEditorContents();
      const nextContents = nextProps.value ?? '';
      if (!this.isEqualValue(nextContents, prevContents)) {
        this.setEditorContents(this.editor!, nextContents);
      }
    }
    if (nextProps.readOnly !== this.props.readOnly) {
      this.setEditorReadOnly(this.editor!, nextProps.readOnly!);
    }
    return [...this.cleanProps, ...this.dirtyProps].some((prop) => {
      return !isEqual((nextProps as any)[prop], (this.props as any)[prop]);
    });
  }

  shouldComponentRegenerate(nextProps: RichTextEditorProps) {
    return this.dirtyProps.some((prop) => {
      return !isEqual((nextProps as any)[prop], (this.props as any)[prop]);
    });
  }

  componentDidMount() {
    this.instantiateEditor();
    this.setEditorContents(this.editor!, this.props.value ?? '');
  }

  componentWillUnmount() {
    this.destroyEditor();
  }

  componentDidUpdate(prevProps: RichTextEditorProps, prevState: RichTextEditorState) {
    if (this.editor && this.shouldComponentRegenerate(prevProps)) {
      const delta = this.editor.getContents();
      const selection = this.editor.getSelection();
      this.regenerationSnapshot = { delta, selection };
      this.setState({ generation: this.state.generation + 1 });
      this.destroyEditor();
    }
    if (this.state.generation !== prevState.generation) {
      const { delta, selection } = this.regenerationSnapshot!;
      delete this.regenerationSnapshot;
      this.instantiateEditor();
      const editor = this.editor!;
      editor.setContents(delta);
      postpone(() => this.setEditorSelection(editor, selection));
    }
  }

  instantiateEditor() {
    if (this.editor) {
      this.hookEditor(this.editor);
    } else {
      this.editor = this.createEditor(
        this.getEditingArea(),
        this.getEditorConfig()
      );
    }
  }

  destroyEditor() {
    if (!this.editor) return;
    this.unhookEditor(this.editor);
  }

  isControlled() {
    return 'value' in this.props;
  }

  getEditorConfig() {
    return {
      bounds: this.props.bounds,
      formats: this.props.formats,
      modules: this.props.modules,
      placeholder: this.props.placeholder,
      readOnly: this.props.readOnly,
      tabIndex: this.props.tabIndex,
      theme: this.props.theme,
      registry: this.props.registry,
    };
  }

  getEditor() {
    if (!this.editor) throw new Error('Accessing non-instantiated editor');
    return this.editor;
  }

  createEditor(element: HTMLElement, config: QuillOptions) {
    const { tabIndex, ...quillConfig } = config as any;
    const editor = new Quill(element, quillConfig);
    if (tabIndex != null) {
      this.setEditorTabIndex(editor, tabIndex);
    }
    this.hookEditor(editor);
    return editor;
  }

  hookEditor(editor: Quill) {
    this.unprivilegedEditor = this.makeUnprivilegedEditor(editor);
    editor.on('editor-change', this.onEditorChange);
  }

  unhookEditor(editor: Quill) {
    editor.off('editor-change', this.onEditorChange);
  }

  getEditorContents() {
    return this.value;
  }

  getEditorSelection() {
    return this.selection;
  }

  isDelta(value: any): value is Delta {
    return value && value.ops;
  }

  isEqualValue(value: any, nextValue: any) {
    if (this.isDelta(value) && this.isDelta(nextValue)) {
      return isEqual(value.ops, nextValue.ops);
    } else {
      return isEqual(value, nextValue);
    }
  }

  setEditorContents(editor: Quill, value: string | Delta) {
    this.value = value;
    const sel = this.getEditorSelection();
    if (typeof value === 'string') {
      if (editor.root.innerHTML !== value) {
        editor.root.innerHTML = '';
        editor.clipboard.dangerouslyPasteHTML(0, value);
      }
    } else {
      if (!this.isEqualValue(value, editor.getContents())) {
        editor.setContents(value);
      }
    }
    postpone(() => this.setEditorSelection(editor, sel));
  }

  setEditorSelection(editor: Quill, range: Range | null) {
    this.selection = range;
    if (range) {
      const length = editor.getLength();
      range.index = Math.max(0, Math.min(range.index, length - 1));
      range.length = Math.max(
        0,
        Math.min(range.length, length - 1 - range.index)
      );
      editor.setSelection(range);
    }
  }

  setEditorTabIndex(editor: Quill, tabIndex: number) {
    if ((editor as any)?.scroll?.domNode) {
      (editor as any).scroll.domNode.tabIndex = tabIndex;
    }
  }

  setEditorReadOnly(editor: Quill, value: boolean) {
    if (value) {
      editor.disable();
    } else {
      editor.enable();
    }
  }

  makeUnprivilegedEditor(editor: Quill) {
    const e = editor;
    return {
      getHTML: () => e.root.innerHTML,
      getLength: e.getLength.bind(e),
      getText: e.getText.bind(e),
      getContents: e.getContents.bind(e),
      getSelection: e.getSelection.bind(e),
      getBounds: e.getBounds.bind(e),
    };
  }

  getEditingArea() {
    if (!this.editingArea) {
      throw new Error('Instantiating on missing editing area');
    }
    const element = this.editingArea;
    if (!element) {
      throw new Error('Cannot find element for editing area');
    }
    if ((element as Node).nodeType === 3) {
      throw new Error('Editing area cannot be a text node');
    }
    return element as HTMLElement;
  }

  renderEditingArea() {
    const { children, preserveWhitespace } = this.props;
    const { generation } = this.state;
    const properties = {
      key: generation,
      ref: (instance: HTMLElement | null) => {
        this.editingArea = instance;
      },
    };
    if (React.Children.count(children)) {
      return React.cloneElement(React.Children.only(children) as React.ReactElement, properties);
    }
    return preserveWhitespace ? (
      <pre {...properties} />
    ) : (
      <div {...properties} />
    );
  }

  render() {
    return (
      <div
        id={this.props.id}
        style={this.props.style}
        key={this.state.generation}
        className={`${styles.editor} quill ${this.props.className ?? ''}`}
        onKeyPress={this.props.onKeyPress}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
      >
        {this.renderEditingArea()}
      </div>
    );
  }

  onEditorChange = (
    eventName: string,
    rangeOrDelta: any,
    oldRangeOrDelta: any,
    source: string
  ) => {
    if (eventName === 'text-change') {
      this.onEditorChangeText?.(
        this.editor!.root.innerHTML,
        rangeOrDelta,
        source,
        this.unprivilegedEditor
      );
    } else if (eventName === 'selection-change') {
      this.onEditorChangeSelection?.(
        rangeOrDelta,
        source,
        this.unprivilegedEditor
      );
    }
  };

  onEditorChangeText(
    value: string,
    delta: Delta,
    source: string,
    editor: any
  ) {
    if (!this.editor) return;
    const nextContents = this.isDelta(this.value)
      ? editor.getContents()
      : editor.getHTML();
    if (nextContents !== this.getEditorContents()) {
      this.lastDeltaChangeSet = delta;
      this.value = nextContents;
      this.props.onChange?.(value, delta, source, editor);
    }
  }

  onEditorChangeSelection(
    nextSelection: Range | null,
    source: string,
    editor: any
  ) {
    if (!this.editor) return;
    const currentSelection = this.getEditorSelection();
    const hasGainedFocus = !currentSelection && nextSelection;
    const hasLostFocus = currentSelection && !nextSelection;
    if (isEqual(nextSelection, currentSelection)) return;
    this.selection = nextSelection;
    this.props.onChangeSelection?.(nextSelection, source, editor);
    if (hasGainedFocus) {
      this.props.onFocus?.(nextSelection, source, editor);
    } else if (hasLostFocus) {
      this.props.onBlur?.(currentSelection, source, editor);
    }
  }

  focus() {
    if (!this.editor) return;
    this.editor.focus();
  }

  blur() {
    if (!this.editor) return;
    this.selection = null;
    this.editor.blur();
  }
}

function postpone(fn: () => void) {
  Promise.resolve().then(fn);
}

export default RichTextEditor;
