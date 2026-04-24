// scripts/translate.mjs
// Uso: node scripts/translate.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const LANGUAGES = [
  { code: 'it', deepl: 'IT', name: 'Italiano' },
  { code: 'de', deepl: 'DE', name: 'Tedesco' },
  { code: 'fr', deepl: 'FR', name: 'Francese' },
  { code: 'es', deepl: 'ES', name: 'Spagnolo' },
  { code: 'pt', deepl: 'PT-PT', name: 'Portoghese' },
  { code: 'ja', deepl: 'JA', name: 'Giapponese' },
  { code: 'zh', deepl: 'ZH', name: 'Cinese' },
  { code: 'ar', deepl: 'AR', name: 'Arabo' },
]

// Termini da NON tradurre mai
const PROTECTED_TERMS = [
  'Dashboard', 'Pro', 'Business', 'Free', 'VaultTransfer',
  'GDPR', 'TLS', 'HTTPS', 'API', 'Stripe', 'Supabase', 'Vercel',
  'AdSense', 'Cloudflare', 'DSA', 'CSAM',
]

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) { console.error('❌ .env.local non trovato'); process.exit(1) }
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
    if (key === 'DEEPL_API_KEY') return value
  }
  console.error('❌ DEEPL_API_KEY non trovata'); process.exit(1)
}

const BASE_URL = 'https://api-free.deepl.com'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function fetchWithRetry(url, options, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options)
    if (res.status === 429) {
      const wait = (i + 1) * 3000
      console.log(`  ⏳ Rate limit, aspetto ${wait / 1000}s...`)
      await sleep(wait)
      continue
    }
    return res
  }
  throw new Error('Troppi tentativi falliti (429)')
}

function encodePlaceholders(text) {
  const vars = []
  let encoded = text

  // Prima proteggi i termini fissi (case-sensitive, parola intera)
  for (const term of PROTECTED_TERMS) {
    const regex = new RegExp(`(?<![\\w])${term}(?![\\w])`, 'g')
    encoded = encoded.replace(regex, () => {
      vars.push(term)
      return `__V${vars.length - 1}__`
    })
  }

  // Poi proteggi le variabili {nome}
  encoded = encoded.replace(/\{(\w+)\}/g, (match) => {
    vars.push(match)
    return `__V${vars.length - 1}__`
  })

  return { encoded, vars }
}

function decodePlaceholders(text, vars) {
  return text.replace(/__V(\d+)__/g, (_, idx) => vars[parseInt(idx)] ?? `__V${idx}__`)
}

function extractStrings(obj, keyPath = '', result = []) {
  if (Array.isArray(obj)) return result
  if (typeof obj === 'string') {
    result.push({ path: keyPath, value: obj })
    return result
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      extractStrings(value, keyPath ? `${keyPath}.${key}` : key, result)
    }
  }
  return result
}

async function translateBatch(strings, targetLang, apiKey) {
  const BATCH_SIZE = 50
  const results = []

  const prepared = strings.map(s => {
    const { encoded, vars } = encodePlaceholders(s.value)
    return { path: s.path, encoded, vars }
  })

  for (let i = 0; i < prepared.length; i += BATCH_SIZE) {
    const chunk = prepared.slice(i, i + BATCH_SIZE)
    console.log(`  📤 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(prepared.length / BATCH_SIZE)} (${chunk.length} stringhe)`)

    const res = await fetchWithRetry(`${BASE_URL}/v2/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: chunk.map(t => t.encoded),
        source_lang: 'EN',
        target_lang: targetLang,
        preserve_formatting: true,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`DeepL error ${res.status}: ${err}`)
    }

    const data = await res.json()
    for (let j = 0; j < chunk.length; j++) {
      const translated = data.translations[j].text
      const restored = decodePlaceholders(translated, chunk[j].vars)
      results.push({ path: chunk[j].path, translated: restored })
    }

    if (i + BATCH_SIZE < prepared.length) await sleep(1000)
  }

  return results
}

function rebuildObject(original, translations) {
  const map = {}
  for (const { path, translated } of translations) map[path] = translated

  function rebuild(obj, keyPath = '') {
    if (Array.isArray(obj)) return obj
    if (typeof obj === 'string') return map[keyPath] ?? obj
    if (typeof obj === 'object' && obj !== null) {
      const result = {}
      for (const [key, value] of Object.entries(obj)) {
        result[key] = rebuild(value, keyPath ? `${keyPath}.${key}` : key)
      }
      return result
    }
    return obj
  }
  return rebuild(original)
}

async function main() {
  const apiKey = loadEnv()

  const enPath = path.join(ROOT, 'messages', 'en.json')
  if (!fs.existsSync(enPath)) { console.error('❌ messages/en.json non trovato'); process.exit(1) }
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'))

  const usageRes = await fetch(`${BASE_URL}/v2/usage`, {
    headers: { 'Authorization': `DeepL-Auth-Key ${apiKey}` },
  })
  const usage = await usageRes.json()
  console.log(`\n📊 DeepL: ${usage.character_count.toLocaleString()} / ${usage.character_limit.toLocaleString()} caratteri usati`)
  console.log(`   Rimanenti: ${(usage.character_limit - usage.character_count).toLocaleString()} caratteri`)
  console.log(`   Termini protetti: ${PROTECTED_TERMS.join(', ')}\n`)

  const strings = extractStrings(enJson)
  console.log(`   Stringhe da tradurre: ${strings.length}\n`)

  const messagesDir = path.join(ROOT, 'messages')

  for (const lang of LANGUAGES) {
    const outputPath = path.join(messagesDir, `${lang.code}.json`)

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  ${lang.name} (${lang.code}) — già esistente, skip`)
      continue
    }

    console.log(`\n🌍 Traduco in ${lang.name} (${lang.code})...`)

    try {
      const translations = await translateBatch(strings, lang.deepl, apiKey)
      const translated = rebuildObject(enJson, translations)
      fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf-8')
      console.log(`✅ ${lang.name} → messages/${lang.code}.json`)
      await sleep(2000)
    } catch (err) {
      console.error(`\n❌ Errore per ${lang.name}: ${err.message}`)
    }
  }

  console.log('\n🎉 Traduzione completata!\n')
}

main()
