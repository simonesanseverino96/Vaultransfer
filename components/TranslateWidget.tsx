'use client'

import { useEffect } from 'react'

export default function TranslateWidget() {
  useEffect(() => {
    // Aggiungi lo script Google Translate
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    // Inizializza il widget
    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'it',
          includedLanguages: 'en,ar,zh-CN,ja,fr,de,es,pt,ru,ko',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    // Rimuovi il banner Google Translate in alto
    const style = document.createElement('style')
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      body { top: 0 !important; }
      .goog-te-gadget { font-size: 0 !important; }
      .goog-te-gadget .goog-te-combo {
        font-size: 12px !important;
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        color: #6b7280 !important;
        border-radius: 8px !important;
        padding: 4px 8px !important;
        cursor: pointer !important;
        outline: none !important;
        font-family: monospace !important;
      }
      .goog-te-gadget .goog-te-combo:hover {
        border-color: #00e5a0 !important;
        color: #f4f1eb !important;
      }
      .goog-logo-link { display: none !important; }
      .goog-te-gadget span { display: none !important; }
      #goog-gt-tt { display: none !important; }
      .goog-te-balloon-frame { display: none !important; }
    `
    document.head.appendChild(style)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      id="google_translate_element"
      className="flex items-center"
    />
  )
}