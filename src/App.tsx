import { useState, useRef, useEffect } from 'react'
import './App.css'
import { translateService } from './services/translate'
import Editor from '@monaco-editor/react'

// Define types
interface Field {
  path: string
  value: string
  type: string
}

function App() {
  // Editor refs
  const editorRef = useRef<any>(null)
  const resultEditorRef = useRef<any>(null)

  // State management
  const [jsonInput, setJsonInput] = useState('')
  const [hasClickedEditor, setHasClickedEditor] = useState(false)
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [fields, setFields] = useState<Field[]>([])
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [translatedJson, setTranslatedJson] = useState(null)
  const [editedTranslatedJson, setEditedTranslatedJson] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationProgress, setTranslationProgress] = useState(0)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // 防抖相关
  const parseTimeoutRef = useRef<any>(null)

  // Supported languages
  const languages = [
    { code: 'en', name: '英语' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日语' },
    { code: 'ko', name: '韩语' },
    { code: 'fr', name: '法语' },
    { code: 'de', name: '德语' },
    { code: 'es', name: '西班牙语' },
    { code: 'ru', name: '俄语' },
    { code: 'ar', name: '阿拉伯语' },
  ]

  // 清理定时器
  useEffect(() => {
    return () => {
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current)
      }
    }
  }, [])

  // Editor configuration handlers
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Set JSON language
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, 'json')
    }

    // Add click event to hide placeholder when user clicks on editor
    const editorDomNode = editor.getDomNode()
    if (editorDomNode && !hasClickedEditor) {
      const handleClick = () => {
        setHasClickedEditor(true)
      }

      editorDomNode.addEventListener('click', handleClick)
    }

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      readOnly: false,
      formatOnPaste: true,
      formatOnType: true,
    })

    // Validate JSON
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

  const parseJsonWithDebounce = (value: string) => {
    // 清除之前的定时器
    if (parseTimeoutRef.current) {
      clearTimeout(parseTimeoutRef.current)
    }

    // 设置新的定时器
    parseTimeoutRef.current = setTimeout(() => {
      // 实时解析JSON并更新字段列表
      if (value.trim() === '') {
        // 清空时重置所有状态
        setParsedJson(null)
        setFields([])
        setSelectedFields(new Set())
        setError('')
      } else {
        // 尝试解析JSON
        try {
          const parsed = JSON.parse(value)
          setParsedJson(parsed)
          const extractedFields = extractFields(parsed)
          setFields(extractedFields)
          setSelectedFields(new Set())
          setError('')
        } catch (err) {
          // JSON格式错误时不显示字段，但也不显示错误信息（避免干扰输入）
          setParsedJson(null)
          setFields([])
          setSelectedFields(new Set())
          setError('')
        }
      }
    }, 300) // 300ms 防抖延迟
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setJsonInput(value)
      parseJsonWithDebounce(value)
    }
  }

  const formatJsonInEditor = () => {
    if (editorRef.current) {
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

  // Result editor handlers
  const handleResultEditorDidMount = (editor: any, monaco: any) => {
    resultEditorRef.current = editor

    // Set JSON language
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, 'json')
    }

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      readOnly: false,
      formatOnPaste: true,
      formatOnType: true,
    })

    // Validate JSON
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

  const handleResultEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditedTranslatedJson(value)
    }
  }

  const formatResultJson = () => {
    if (resultEditorRef.current) {
      try {
        const editor = resultEditorRef.current
        const text = editor.getValue()
        const parsed = JSON.parse(text)
        const formatted = JSON.stringify(parsed, null, 2)
        editor.setValue(formatted)
        setEditedTranslatedJson(formatted)
      } catch (error) {
        console.error('Failed to format result JSON:', error)
      }
    }
  }

  const compressResultJson = () => {
    if (resultEditorRef.current) {
      try {
        const editor = resultEditorRef.current
        const text = editor.getValue()
        const parsed = JSON.parse(text)
        const compressed = JSON.stringify(parsed, null, 0)
        editor.setValue(compressed)
        setEditedTranslatedJson(compressed)
      } catch (error) {
        console.error('Failed to compress result JSON:', error)
      }
    }
  }

  const copyResultToClipboard = async () => {
    let text = ''

    try {
      // 尝试获取翻译结果文本
      if (resultEditorRef.current) {
        text = resultEditorRef.current.getValue()
      } else if (editedTranslatedJson) {
        text = editedTranslatedJson
      } else if (translatedJson) {
        text = JSON.stringify(translatedJson, null, 2)
      }

      if (!text || text.trim() === '') {
        console.warn('翻译结果为空，无法复制')
        return
      }

      // 使用 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        console.log('复制成功，内容长度:', text.length)

        // 显示成功提示
        setCopySuccess(true)
        setTimeout(() => {
          setCopySuccess(false)
        }, 2000)
      } else {
        // 降级方案：使用传统的复制方法
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        console.log('复制成功（降级方案），内容长度:', text.length)

        // 显示成功提示
        setCopySuccess(true)
        setTimeout(() => {
          setCopySuccess(false)
        }, 2000)
      }
    } catch (err) {
      console.error('复制失败:', err)
      // 降级尝试
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text || ''
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        console.log('复制成功（紧急降级方案）')
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (fallbackErr) {
        console.error('所有复制方法都失败:', fallbackErr)
      }
    }
  }

  // Extract translatable fields from JSON
  const extractFields = (obj: any, prefix = ''): Field[] => {
    const result: Field[] = []

    const traverse = (current: any, path: string) => {
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        Object.entries(current).forEach(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key
          traverse(value, newPath)
        })
      } else if (Array.isArray(current)) {
        current.forEach((item, index) => {
          const newPath = `${path}[${index}]`
          traverse(item, newPath)
        })
      } else if (typeof current === 'string') {
        result.push({
          path: path,
          value: current,
          type: 'string'
        })
      }
    }

    traverse(obj, prefix)
    return result
  }

  // Field selection handlers
  const selectAllFields = () => {
    setSelectedFields(new Set(fields.map(f => f.path)))
  }

  const clearAllFields = () => {
    setSelectedFields(new Set())
  }

  const toggleField = (path: string) => {
    const newSelected = new Set(selectedFields)
    if (newSelected.has(path)) {
      newSelected.delete(path)
    } else {
      newSelected.add(path)
    }
    setSelectedFields(newSelected)
  }

  // Utility functions

  const resetAll = () => {
    setJsonInput('')
    setHasClickedEditor(false)

    // Clear Monaco Editors
    if (editorRef.current) {
      editorRef.current.setValue('')
    }

    if (resultEditorRef.current) {
      resultEditorRef.current.setValue('')
    }

    setParsedJson(null)
    setFields([])
    setSelectedFields(new Set())
    setTranslatedJson(null)
    setEditedTranslatedJson('')
    setError('')
    setTranslationProgress(0)
  }

  const loadExampleJson = () => {
    const exampleJson = {
      "user": {
        "name": "张三",
        "bio": "这是一位软件工程师的简介",
        "age": 28,
        "city": "北京",
        "skills": ["JavaScript", "React", "Node.js", "Python"],
        "contact": {
          "email": "zhangsan@example.com",
          "phone": "+86 138 0013 8000"
        },
        "projects": [
          {
            "name": "电商平台",
            "description": "一个在线购物网站",
            "status": "completed"
          },
          {
            "name": "数据分析系统",
            "description": "企业级数据分析平台",
            "status": "in_progress"
          }
        ]
      },
      "welcome_message": "欢迎访问我们的商店！",
      "notification": "您的订单已确认",
      "navigation": {
        "home": "首页",
        "products": "产品列表",
        "about": "关于我们",
        "contact": "联系方式"
      },
      "settings": {
        "theme": "dark",
        "language": "zh-CN",
        "notifications": true
      }
    }

    const jsonString = JSON.stringify(exampleJson, null, 2)
    setJsonInput(jsonString)
    setHasClickedEditor(true) // Hide placeholder when loading example

    // Set content in Monaco Editor
    if (editorRef.current) {
      editorRef.current.setValue(jsonString)
    }

    setParsedJson(exampleJson)
    setError('')
    const extractedFields = extractFields(exampleJson)
    setFields(extractedFields)
    setSelectedFields(new Set())
  }

  // Translation function
  const translate = async () => {
    if (selectedFields.size === 0) {
      setError('请至少选择一个字段进行翻译')
      return
    }

    setIsTranslating(true)
    setTranslationProgress(0)
    setError('')

    try {
      const result = { ...parsedJson }
      const totalFields = selectedFields.size
      let completedFields = 0

      // Process each selected field
      for (const fieldPath of selectedFields) {
        const field = fields.find(f => f.path === fieldPath)
        if (field) {
          console.log(`Translating: "${field.value}" to ${targetLanguage}`)
          const translatedValue = await translateService.translateText(field.value, targetLanguage)
          console.log(`Translation result: "${translatedValue}"`)

          // Set translated value in result object
          const pathParts = (fieldPath as string).split(/[\.\[\]]+/).filter((p: any) => p)
          let current = result

          for (let i = 0; i < pathParts.length - 1; i++) {
            if (!current[pathParts[i]]) {
              current[pathParts[i]] = {}
            }
            current = current[pathParts[i]]
          }

          current[pathParts[pathParts.length - 1]] = translatedValue
          completedFields++
          setTranslationProgress(Math.round((completedFields / totalFields) * 100))
        }
      }

      setTranslatedJson(result)
      const resultString = JSON.stringify(result, null, 2)
      setEditedTranslatedJson(resultString)

      // Set content in result editor
      if (resultEditorRef.current) {
        resultEditorRef.current.setValue(resultString)
      }

      setError('')
    } catch (err) {
      setError('翻译失败: ' + (err as Error).message)
    } finally {
      setIsTranslating(false)
      setTranslationProgress(0)
    }
  }

  
  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1>JSON 翻译工具</h1>
        </header>

        {/* Main Layout */}
        <div className="layout-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* JSON Input Area */}
            <div className="card">
              <div className="card-header">
                <div className="header-content">
                  <h2>原始JSON输入</h2>
                  <div className="button-group">
                    <button onClick={loadExampleJson} className="btn-primary">
                      加载示例JSON
                    </button>
                    <button onClick={formatJsonInEditor} className="btn-secondary">
                      格式化
                    </button>
                    <button onClick={resetAll} className="btn-danger">
                      重置
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <div className="editor-container">
                  {!jsonInput && !hasClickedEditor && (
                    <div className="editor-empty-state">
                      <div className="empty-icon">📄</div>
                      <p>请输入JSON数据</p>
                    </div>
                  )}
                  <Editor
                    height="450px"
                    defaultLanguage="json"
                    value={jsonInput}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      readOnly: false,
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                  />
                </div>
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Field Selection and Translation Settings */}
            <div className="two-column-layout">
              {/* Field Selection */}
              <div className="card">
                <div className="card-header">
                  <div className="header-content">
                    <h3>选择翻译字段 ({selectedFields.size}/{fields.length})</h3>
                    <div className="small-button-group">
                      <button onClick={selectAllFields} className="btn-small btn-success">
                        全选
                      </button>
                      <button onClick={clearAllFields} className="btn-small btn-secondary">
                        清除
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  {fields.length > 0 ? (
                    <div className="field-list">
                      {fields.map((field) => (
                        <label key={field.path} className="field-item">
                          <input
                            type="checkbox"
                            checked={selectedFields.has(field.path)}
                            onChange={() => toggleField(field.path)}
                          />
                          <span className="field-path">{field.path}</span>
                        </label>
                      ))}
                    </div>
                  ) : jsonInput.trim() ? (
                    <div className="empty-state">
                      <div className="empty-icon">⚠️</div>
                      <p>JSON格式错误或无可翻译字段</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>请检查JSON格式或确保包含字符串字段</p>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📄</div>
                      <p>输入JSON后将自动解析字段</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Translation Settings */}
              <div className="card">
                <div className="card-header">
                  <div className="header-content">
                    <h3>翻译设置</h3>
                  </div>
                </div>
                <div className="card-content">
                  <div className="form-group">
                    <label>目标语言</label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="form-select"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={translate}
                    disabled={isTranslating || selectedFields.size === 0}
                    className={`btn-success full-width ${isTranslating || selectedFields.size === 0 ? 'disabled' : ''}`}
                  >
                    {isTranslating ? '翻译中...' : '开始翻译'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Translation Results */}
          <div className="right-column">
            <div className="card">
              <div className="card-header">
                <div className="header-content">
                  <h2>翻译结果 (可编辑)</h2>
                  <div className="button-group">
                    <button
                      onClick={copyResultToClipboard}
                      disabled={!translatedJson || isTranslating}
                      className={`btn-primary ${copySuccess ? 'success' : ''}`}
                      title={!translatedJson ? '请先完成翻译' : isTranslating ? '翻译进行中' : '复制翻译结果'}
                    >
                      {copySuccess ? '✓ 已复制' : '复制'}
                    </button>
                    <button
                      onClick={formatResultJson}
                      disabled={!translatedJson || isTranslating}
                      className="btn-success"
                      title={!translatedJson ? '请先完成翻译' : isTranslating ? '翻译进行中' : '格式化JSON'}
                    >
                      格式化
                    </button>
                    <button
                      onClick={compressResultJson}
                      disabled={!translatedJson || isTranslating}
                      className="btn-warning"
                      title={!translatedJson ? '请先完成翻译' : isTranslating ? '翻译进行中' : '压缩JSON'}
                    >
                      压缩
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-content">
                {isTranslating && (
                  <div className="translation-progress">
                    正在翻译中... {translationProgress}%
                  </div>
                )}
                {translatedJson ? (
                  <div className="editor-container">
                    <Editor
                      height="100%"
                      defaultLanguage="json"
                      value={editedTranslatedJson}
                      onChange={handleResultEditorChange}
                      onMount={handleResultEditorDidMount}
                      theme="vs"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                        readOnly: false,
                        formatOnPaste: true,
                        formatOnType: true,
                      }}
                    />
                  </div>
                ) : (
                  <div className="empty-state large">
                    <div className="empty-icon large">
                      {parsedJson && fields.length > 0 ? "🌐" : parsedJson ? "📄" : "🎯"}
                    </div>
                    <h3>
                      {parsedJson && fields.length > 0
                        ? "选择字段并开始翻译"
                        : parsedJson
                          ? "未找到可翻译的字段"
                          : "等待翻译结果"
                      }
                    </h3>
                    <p>
                      {parsedJson && fields.length > 0
                        ? `左侧已解析出 ${fields.length} 个可翻译字段，选择后点击"开始翻译"`
                        : parsedJson
                          ? "请在左侧输入包含字符串字段的JSON数据"
                          : "完成翻译后，结果将在此显示，支持编辑和复制"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App