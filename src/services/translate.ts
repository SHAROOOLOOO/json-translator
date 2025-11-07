class TranslateService {
  private languageMap: Record<string, string> = {
    'en': 'English',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'ru': 'Russian'
  }

  // Google Translate language codes
  private googleLanguageMap: Record<string, string> = {
    'en': 'en',
    'zh': 'zh',
    'ja': 'ja',
    'ko': 'ko',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'ru': 'ru',
    'ar': 'ar'
  }

  // 常用词汇本地缓存 (最后的备用方案)
  private localDictionary: Record<string, Record<string, string>> = {
    // 问候语
    '你好': {
      'en': 'Hello',
      'ja': 'こんにちは',
      'ko': '안녕하세요',
      'fr': 'Bonjour',
      'de': 'Hallo',
      'es': 'Hola',
      'ru': 'Привет',
      'ar': 'مرحبا'
    },
    '谢谢': {
      'en': 'Thank you',
      'ja': 'ありがとう',
      'ko': '감사합니다',
      'fr': 'Merci',
      'de': 'Danke',
      'es': 'Gracias',
      'ru': 'Спасибо',
      'ar': 'شكرا'
    },
    '再见': {
      'en': 'Goodbye',
      'ja': 'さようなら',
      'ko': '안녕히 계세요',
      'fr': 'Au revoir',
      'de': 'Auf Wiedersehen',
      'es': 'Adiós',
      'ru': 'До свидания',
      'ar': 'وداعا'
    },
    '欢迎': {
      'en': 'Welcome',
      'ja': 'ようこそ',
      'ko': '환영합니다',
      'fr': 'Bienvenue',
      'de': 'Willkommen',
      'es': 'Bienvenido',
      'ru': 'Добро пожаловать',
      'ar': 'أهلا بكم'
    },

    // 常用词汇
    '用户': {
      'en': 'User',
      'ja': 'ユーザー',
      'ko': '사용자',
      'fr': 'Utilisateur',
      'de': 'Benutzer',
      'es': 'Usuario',
      'ru': 'Пользователь',
      'ar': 'المستخدم'
    },
    '名称': {
      'en': 'Name',
      'ja': '名前',
      'ko': '이름',
      'fr': 'Nom',
      'de': 'Name',
      'es': 'Nombre',
      'ru': 'Имя',
      'ar': 'الاسم'
    },
    '设置': {
      'en': 'Settings',
      'ja': '設定',
      'ko': '설정',
      'fr': 'Paramètres',
      'de': 'Einstellungen',
      'es': 'Configuración',
      'ru': 'Настройки',
      'ar': 'الإعدادات'
    },
    '帮助': {
      'en': 'Help',
      'ja': 'ヘルプ',
      'ko': '도움',
      'fr': 'Aide',
      'de': 'Hilfe',
      'es': 'Ayuda',
      'ru': 'Помощь',
      'ar': 'المساعدة'
    },
    '关于': {
      'en': 'About',
      'ja': 'について',
      'ko': '정보',
      'fr': 'À propos',
      'de': 'Über',
      'es': 'Acerca de',
      'ru': 'О программе',
      'ar': 'حول'
    },
    '主页': {
      'en': 'Home',
      'ja': 'ホーム',
      'ko': '홈',
      'fr': 'Accueil',
      'de': 'Startseite',
      'es': 'Inicio',
      'ru': 'Главная',
      'ar': 'الرئيسية'
    },
    '搜索': {
      'en': 'Search',
      'ja': '検索',
      'ko': '검색',
      'fr': 'Rechercher',
      'de': 'Suche',
      'es': 'Buscar',
      'ru': 'Поиск',
      'ar': 'بحث'
    },
    '登录': {
      'en': 'Login',
      'ja': 'ログイン',
      'ko': '로그인',
      'fr': 'Connexion',
      'de': 'Anmelden',
      'es': 'Iniciar sesión',
      'ru': 'Вход',
      'ar': 'تسجيل الدخول'
    },
    '注册': {
      'en': 'Register',
      'ja': '登録',
      'ko': '가입',
      'fr': "S'inscrire",
      'de': 'Registrieren',
      'es': 'Registrarse',
      'ru': 'Регистрация',
      'ar': 'التسجيل'
    },
    '确认': {
      'en': 'Confirm',
      'ja': '確認',
      'ko': '확인',
      'fr': 'Confirmer',
      'de': 'Bestätigen',
      'es': 'Confirmar',
      'ru': 'Подтвердить',
      'ar': 'تأكيد'
    },
    '取消': {
      'en': 'Cancel',
      'ja': 'キャンセル',
      'ko': '취소',
      'fr': 'Annuler',
      'de': 'Abbrechen',
      'es': 'Cancelar',
      'ru': 'Отмена',
      'ar': 'إلغاء'
    },
    '保存': {
      'en': 'Save',
      'ja': '保存',
      'ko': '저장',
      'fr': 'Enregistrer',
      'de': 'Speichern',
      'es': 'Guardar',
      'ru': 'Сохранить',
      'ar': 'حفظ'
    },
    '删除': {
      'en': 'Delete',
      'ja': '削除',
      'ko': '삭제',
      'fr': 'Supprimer',
      'de': 'Löschen',
      'es': 'Eliminar',
      'ru': 'Удалить',
      'ar': 'حذف'
    },
    '编辑': {
      'en': 'Edit',
      'ja': '編集',
      'ko': '편집',
      'fr': 'Modifier',
      'de': 'Bearbeiten',
      'es': 'Editar',
      'ru': 'Редактировать',
      'ar': 'تحرير'
    }
  }

  /**
   * 真实的翻译服务，采用多层fallback策略
   * 1. MyMemory API (优先，免费，每天10000次请求)
   * 2. LibreTranslate API (开源翻译服务)
   * 3. 本地词典 (备用)
   */
  async translateText(text: string, targetLanguage: string): Promise<string> {
    // 输入验证
    if (!text || text.trim() === '') {
      return text
    }

    // 如果目标语言和文本语言相同，直接返回
    if (this.shouldSkipTranslation(text, targetLanguage)) {
      return text
    }

    try {
      // 优先使用MyMemory API (更稳定)
      console.log(`尝试MyMemory翻译: "${text}" -> ${targetLanguage}`)
      const result = await this.myMemoryTranslate(text, targetLanguage)
      if (result && result !== text) {
        console.log(`✅ MyMemory翻译成功: "${result}"`)
        return result
      }
    } catch (error) {
      console.warn('⚠️ MyMemory翻译失败:', error)
    }

    try {
      // 备用方案：尝试Google Translate (在网络可用时)
      console.log(`尝试Google翻译: "${text}" -> ${targetLanguage}`)
      const result = await Promise.race([
        this.googleTranslate(text, targetLanguage),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Google翻译超时')), 5000)
        )
      ])
      if (result && result !== text) {
        console.log(`✅ Google翻译成功: "${result}"`)
        return result
      }
    } catch (error) {
      console.warn('⚠️ Google翻译失败或超时:', error)
    }

    try {
      // 备用方案：LibreTranslate (如果可用)
      console.log(`尝试Libre翻译: "${text}" -> ${targetLanguage}`)
      const result = await this.libreTranslate(text, targetLanguage)
      if (result && result !== text) {
        console.log(`✅ Libre翻译成功: "${result}"`)
        return result
      }
    } catch (error) {
      console.warn('⚠️ Libre翻译失败:', error)
    }

    try {
      // 最后备用：本地词典
      console.log(`使用本地词典: "${text}" -> ${targetLanguage}`)
      const result = this.localDictionaryTranslate(text, targetLanguage)
      if (result && result !== text && !result.includes('[未翻译:')) {
        console.log(`✅ 本地词典翻译: "${result}"`)
        return result
      }
    } catch (error) {
      console.warn('⚠️ 本地词典翻译失败:', error)
    }

    // 所有方案都失败，返回原文
    console.warn(`❌ 所有翻译方案都失败，返回原文: "${text}"`)
    return text
  }

  /**
   * Google Translate API (免费版本)
   * 使用Google Translate的公开端点，无需API密钥
   */
  private async googleTranslate(text: string, targetLanguage: string): Promise<string> {
    const googleLang = this.googleLanguageMap[targetLanguage]
    if (!googleLang) {
      throw new Error(`不支持的目标语言: ${targetLanguage}`)
    }

    // 检测源语言
    const sourceLang = this.detectLanguage(text)
    if (sourceLang === googleLang) {
      return text // 语言相同，无需翻译
    }

    // 使用Google Translate的免费API端点
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${googleLang}&dt=t&q=${encodeURIComponent(text)}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`Google Translate API错误: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // 解析Google Translate的响应格式
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0]
      }

      throw new Error('Google Translate返回格式错误')
    } catch (error) {
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('网络连接失败，请检查网络连接')
      }
      throw error
    }
  }

  /**
   * MyMemory API (免费翻译服务)
   * 每天提供10000次免费翻译请求
   */
  private async myMemoryTranslate(text: string, targetLanguage: string): Promise<string> {
    const sourceLang = this.detectLanguage(text)
    const langPair = `${sourceLang}|${targetLanguage}`

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`MyMemory API错误: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.responseStatus === 200 && data.responseData.translatedText) {
        const translated = data.responseData.translatedText
        // 如果返回和原文相同，说明翻译失败
        if (translated === text) {
          throw new Error('MyMemory未能翻译文本')
        }
        return translated
      }

      throw new Error('MyMemory翻译失败')
    } catch (error) {
      throw error
    }
  }

  /**
   * LibreTranslate API (开源翻译服务)
   */
  private async libreTranslate(text: string, targetLanguage: string): Promise<string> {
    const sourceLang = this.detectLanguage(text)
    const libreLangMap: Record<string, string> = {
      'en': 'en',
      'zh': 'zh',
      'ja': 'ja',
      'ko': 'ko',
      'fr': 'fr',
      'de': 'de',
      'es': 'es',
      'ru': 'ru',
      'ar': 'ar'
    }

    const sourceLibre = libreLangMap[sourceLang]
    const targetLibre = libreLangMap[targetLanguage]

    if (!sourceLibre || !targetLibre) {
      throw new Error(`LibreTranslate不支持的语言: ${sourceLang} -> ${targetLanguage}`)
    }

    // 使用公共LibreTranslate实例
    const url = 'https://libretranslate.de/translate'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          q: text,
          source: sourceLibre,
          target: targetLibre,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`LibreTranslate API错误: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.translatedText && data.translatedText !== text) {
        return data.translatedText
      }

      throw new Error('LibreTranslate翻译失败')
    } catch (error) {
      throw error
    }
  }

  /**
   * 本地词典翻译 (最后的备用方案)
   */
  private localDictionaryTranslate(text: string, targetLanguage: string): string {
    // 直接查找完整短语
    if (this.localDictionary[text] && this.localDictionary[text][targetLanguage]) {
      return this.localDictionary[text][targetLanguage]
    }

    // 尝试匹配部分文本
    for (const [chinesePhrase, translations] of Object.entries(this.localDictionary)) {
      if (text.includes(chinesePhrase) && translations[targetLanguage]) {
        return text.replace(chinesePhrase, translations[targetLanguage])
      }
    }

    // 如果本地词典中没有，返回带标记的原文
    return `[未翻译: ${text}]`
  }

  /**
   * 智能检测文本语言
   */
  private detectLanguage(text: string): string {
    // 检测中文
    if (/[\u4e00-\u9fff]/.test(text)) {
      return 'zh'
    }

    // 检测日文 (平假名和片假名)
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
      return 'ja'
    }

    // 检测韩文
    if (/[\uac00-\ud7af]/.test(text)) {
      return 'ko'
    }

    // 检测俄文 (西里尔字母)
    if (/[\u0400-\u04ff]/.test(text)) {
      return 'ru'
    }

    // 检测法文特殊字符
    if (/[àâäçéèêëïîôöùûüÿ]/.test(text)) {
      return 'fr'
    }

    // 检测德文特殊字符
    if (/[äöüß]/.test(text)) {
      return 'de'
    }

    // 检测西班牙文特殊字符
    if (/[ñáéíóúü]/.test(text)) {
      return 'es'
    }

    // 默认认为是英文
    return 'en'
  }

  /**
   * 判断是否应该跳过翻译
   */
  private shouldSkipTranslation(text: string, targetLanguage: string): boolean {
    const detectedLang = this.detectLanguage(text)
    const targetGoogleLang = this.googleLanguageMap[targetLanguage]

    return detectedLang === targetGoogleLang
  }

  /**
   * 检查翻译服务是否可用
   */
  async checkServiceAvailability(): Promise<boolean> {
    try {
      // 测试Google翻译
      const testResult = await this.googleTranslate('Hello', 'zh')
      return testResult === '你好'
    } catch (error) {
      console.warn('翻译服务检查失败:', error)
      return false
    }
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLanguages(): Array<{ code: string; name: string }> {
    return Object.entries(this.languageMap).map(([code, name]) => ({
      code,
      name
    }))
  }
}

export const translateService = new TranslateService()