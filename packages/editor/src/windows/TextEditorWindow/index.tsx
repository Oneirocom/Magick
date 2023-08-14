import { Window } from '@magickml/client-core';
import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import '../../screens/Magick/magick.module.css';
import WindowMessage from '../../components/WindowMessage';
import { TextEditorData, useInspector } from '../../contexts/InspectorProvider';

const TextEditor = (props) => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TextEditorData | null>(null);
  const [editorOptions] = useState<Record<string, any>>({
    wordWrap: 'on',
    minimap: { enabled: false },
  });
  const codeRef = useRef<string>();

  const { textEditorData, saveTextEditor, inspectorData } = useInspector();

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      wordWrap: true,
      colors: {
        'editor.background': '#272727',
      },
    });
  };

  useEffect(() => {
    setData(textEditorData);
    setCode(textEditorData.data);
  }, [textEditorData]);

  useEffect(() => {
    const saveWithDebounce = debounce(() => {
      save(codeRef.current);
    }, 1000); 

    if (codeRef.current !== code) {
      codeRef.current = code;
      saveWithDebounce();
    }
  }, [code]);

  const save = (newCode) => {
    const update = {
      ...data,
      data: newCode,
    };
    setData(update);
    saveTextEditor(update);
  };

  const updateCode = (rawCode) => {
    const code = rawCode.replace('\r\n', '\n');
    setCode(code);
  };

  const toolbar = (
    <>
      <div style={{ marginTop: 'var(--c1)' }}>
        {textEditorData?.name && textEditorData?.name}
      </div>
    </>
  );

  if (!textEditorData?.control)
    return <WindowMessage content="Select a node with a text field" />;

  return (
    <Window key={inspectorData?.nodeId} toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        language={textEditorData?.options?.language}
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={updateCode}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  );
};

export default TextEditor;
