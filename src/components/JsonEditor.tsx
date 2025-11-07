import { useRef } from 'react'
import Editor from '@monaco-editor/react'

interface JsonEditorProps {
  value: any
  onChange?: (value: string) => void
  readonly?: boolean
  height?: string
  title?: string
}

export default function JsonEditor({
  value,
  onChange,
  readonly = false,
  height = '400px',
  title
}: JsonEditorProps) {
  const editorRef = useRef<any>(null)

  const jsonString = typeof value === 'string' ? value : JSON.stringify(value, null, 2)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Set JSON language
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, 'json')
    }

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 12,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      readOnly: readonly,
      formatOnPaste: true,
      formatOnType: true,
    })

    // Validate JSON
    if (!readonly) {
      const validateJson = () => {
        try {
          const text = editor.getValue()
          if (text.trim()) {
            JSON.parse(text)
            monaco.editor.setModelMarkers(model, 'json', [])
          }
        } catch (error) {
          const markers = [{
            severity: monaco.MarkerSeverity.Error,
            message: 'Invalid JSON: ' + (error as Error).message,
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          }]
          monaco.editor.setModelMarkers(model, 'json', markers)
        }
      }

      // Validate on content change
      editor.onDidChangeModelContent(validateJson)

      // Initial validation
      validateJson()
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value)
    }
  }

  const formatJson = () => {
    if (editorRef.current && !readonly) {
      try {
        const editor = editorRef.current
        const text = editor.getValue()
        const parsed = JSON.parse(text)
        const formatted = JSON.stringify(parsed, null, 2)
        editor.setValue(formatted)
      } catch (error) {
        console.error('Failed to format JSON:', error)
      }
    }
  }

  const copyToClipboard = () => {
    if (editorRef.current) {
      const text = editorRef.current.getValue()
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {title && (
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <div className="flex space-x-2">
            {!readonly && (
              <button
                onClick={formatJson}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                格式化
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              复制
            </button>
          </div>
        </div>
      )}
      <Editor
        height={height}
        defaultLanguage="json"
        value={jsonString}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 12,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          readOnly: readonly,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  )
}