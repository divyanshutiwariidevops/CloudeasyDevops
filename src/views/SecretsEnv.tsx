'use client'

import { useEffect, useMemo, useState } from 'react'
import { revealSecret } from '../api/secrets'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { useApp } from '../context/AppContext'
import { usePaged } from '../hooks/usePaged'
import type { SecretVariable } from '../types'
import { maskSecret } from '../utils'

type Lang = 'en' | 'hi'

const COPY = {
  en: {
    title: 'Secrets',
    lead: 'Values stay sealed with AES-256-GCM. The list never includes the secret. Reveal opens only the one you choose.',
    banner: 'Encrypted at rest. A revealed value stays in this tab until you hide it.',
    search: 'Search secrets...',
    empty: 'No secrets yet. Add one to store it in the encrypted vault.',
    none: 'No secrets match this search.',
    add: '+ Add secret',
    sealed: 'Sealed',
    hide: 'Hide',
    reveal: 'Reveal',
    copy: 'Copy',
    edit: 'Edit',
    del: 'Delete',
    editTitle: 'Edit secret',
    addTitle: 'Add secret',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    name: 'Name',
    value: 'Value',
    namePh: 'e.g. Production API key',
    valuePh: 'Paste or type the secret here...',
    deleteTitle: 'Delete secret',
    deleteBody: 'Remove this secret from the encrypted vault?',
    nameRequired: 'Name is required',
    valueRequired: 'Value is required',
    updated: 'Secret updated',
    saved: 'Secret encrypted and saved',
    copied: 'Value copied',
    copyFail: 'Unable to copy',
    deleted: 'Secret deleted',
    revealFail: 'Unable to reveal secret',
    saveFail: 'Unable to save secret',
    deleteFail: 'Unable to delete secret',
  },
  hi: {
    title: 'सीक्रेट',
    lead: 'मान AES-256-GCM से सील रहते हैं। सूची में सीक्रेट नहीं आता। Reveal सिर्फ वही खोलता है जिसे आप चुनते हैं।',
    banner: 'डेटाबेस में एन्क्रिप्टेड। खोला गया मान इसी टैब में रहता है, जब तक आप उसे छिपा न दें।',
    search: 'सीक्रेट खोजें...',
    empty: 'अभी कोई सीक्रेट नहीं। एन्क्रिप्टेड वॉल्ट में रखने के लिए एक जोड़ें।',
    none: 'इस खोज से कोई सीक्रेट नहीं मिला।',
    add: '+ सीक्रेट जोड़ें',
    sealed: 'सील',
    hide: 'छिपाएँ',
    reveal: 'दिखाएँ',
    copy: 'कॉपी',
    edit: 'संपादित',
    del: 'हटाएँ',
    editTitle: 'सीक्रेट बदलें',
    addTitle: 'सीक्रेट जोड़ें',
    cancel: 'रद्द',
    save: 'सहेजें',
    saving: 'सहेज रहे हैं…',
    name: 'नाम',
    value: 'मान',
    namePh: 'उदाहरण: प्रोडक्शन API कुंजी',
    valuePh: 'सीक्रेट यहाँ लिखें या पेस्ट करें...',
    deleteTitle: 'सीक्रेट हटाएँ',
    deleteBody: 'क्या इस सीक्रेट को एन्क्रिप्टेड वॉल्ट से हटा दें?',
    nameRequired: 'नाम ज़रूरी है',
    valueRequired: 'मान ज़रूरी है',
    updated: 'सीक्रेट अपडेट हो गया',
    saved: 'सीक्रेट एन्क्रिप्ट होकर सहेज लिया गया',
    copied: 'मान कॉपी हो गया',
    copyFail: 'कॉपी नहीं हो सका',
    deleted: 'सीक्रेट हट गया',
    revealFail: 'सीक्रेट नहीं खुल सका',
    saveFail: 'सीक्रेट सहेज नहीं हो सका',
    deleteFail: 'सीक्रेट हट नहीं सका',
  },
} as const

const emptyForm = { name: '', value: '' }

export function SecretsEnv() {
  const { secrets, addSecret, updateSecret, deleteSecret, pushToast, can, preferences } = useApp()
  const canManage = can('secrets.manage')
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState<Lang>('en')
  const [revealed, setRevealed] = useState<Record<string, string>>({})
  const text = COPY[lang]

  useEffect(() => {
    if (localStorage.getItem('esp-secrets-lang') === 'hi') setLang('hi')
  }, [])
  const [mode, setMode] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [active, setActive] = useState<SecretVariable | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(
    () => secrets.filter((secret) => secret.key.toLowerCase().includes(query.toLowerCase())),
    [query, secrets],
  )
  const paged = usePaged(filtered, preferences.itemsPerPage)

  const close = () => {
    setMode(null)
    setActive(null)
    setForm(emptyForm)
  }

  const openCreate = () => {
    setActive(null)
    setForm(emptyForm)
    setMode('create')
  }

  const save = async () => {
    if (!form.name.trim()) {
      pushToast(text.nameRequired, 'warning')
      return
    }
    if (!form.value.trim()) {
      pushToast(text.valueRequired, 'warning')
      return
    }
    setSaving(true)
    try {
      if (mode === 'edit' && active) {
        await updateSecret({ ...active, key: form.name.trim(), value: form.value })
        setRevealed((current) => {
          const next = { ...current }
          delete next[active.id]
          return next
        })
        pushToast(text.updated)
      } else {
        await addSecret({
          key: form.name.trim(),
          value: form.value,
          description: '',
          environment: 'Production',
          projectId: '',
        })
        pushToast(text.saved)
      }
      close()
    } catch (error) {
      pushToast(error instanceof Error ? error.message : text.saveFail, 'error')
    } finally {
      setSaving(false)
    }
  }

  const chooseLang = (next: Lang) => {
    setLang(next)
    localStorage.setItem('esp-secrets-lang', next)
  }

  const loadValue = async (id: string) => {
    if (revealed[id]) return revealed[id]
    const data = await revealSecret(id)
    setRevealed((current) => ({ ...current, [id]: data.value }))
    return data.value
  }

  return (
    <div className="secrets-page">
      <div className="secrets-hero">
        <div>
          <h2 className="secrets-title">{text.title}</h2>
          <p className="secrets-copy mb-0">{text.lead}</p>
        </div>
        <div className="secrets-hero-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => chooseLang('en')}>
              English
            </button>
            <button type="button" className={lang === 'hi' ? 'active' : ''} onClick={() => chooseLang('hi')}>
              हिन्दी
            </button>
          </div>
          {canManage ? (
            <button type="button" className="btn btn-secret" onClick={openCreate}>
              {text.add}
            </button>
          ) : null}
        </div>
      </div>

      <div className="secret-banner">
        <i className="bi bi-lock-fill" />
        {text.banner}
      </div>

      <div className="secrets-toolbar">
        <input
          className="form-control secret-search"
          placeholder={text.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="secret-empty">
          {secrets.length === 0 ? (
            <>
              <p className="mb-3">{text.empty}</p>
              {canManage ? (
                <button type="button" className="btn btn-secret" onClick={openCreate}>
                  {text.add}
                </button>
              ) : null}
            </>
          ) : (
            <p className="mb-0">{text.none}</p>
          )}
        </div>
      ) : (
        <div className="secret-list">
          <div className="secret-grid">
            {paged.rows.map((secret) => {
              const openValue = revealed[secret.id]
              const open = openValue != null
              return (
                <article className={`secret-card ${open ? 'is-open' : ''}`} key={secret.id}>
                  <div className="secret-card-head">
                    <span className="secret-card-icon">
                      <i className="bi bi-shield-lock-fill" />
                    </span>
                    <div className="secret-card-titles">
                      <div className="secret-card-name-row">
                        <h3 title={secret.key}>{secret.key}</h3>
                        <span className="secret-env-pill">ENV</span>
                      </div>
                      <p>{text.sealed}</p>
                    </div>
                  </div>
                  <div className="secret-value-well">
                    <code>{open ? openValue : maskSecret('')}</code>
                  </div>
                  <div className="secret-card-actions">
                    <button
                      type="button"
                      className="secret-action"
                      onClick={() => {
                        if (open) {
                          setRevealed((current) => {
                            const next = { ...current }
                            delete next[secret.id]
                            return next
                          })
                          return
                        }
                        void loadValue(secret.id).catch((error) => {
                          pushToast(error instanceof Error ? error.message : text.revealFail, 'error')
                        })
                      }}
                    >
                      <i className={`bi ${open ? 'bi-eye-slash' : 'bi-eye'}`} />
                      {open ? text.hide : text.reveal}
                    </button>
                    <button
                      type="button"
                      className="secret-action"
                      onClick={() => {
                        void loadValue(secret.id)
                          .then(async (value) => {
                            await navigator.clipboard.writeText(value)
                            pushToast(text.copied)
                          })
                          .catch((error) => {
                            pushToast(error instanceof Error ? error.message : text.copyFail, 'warning')
                          })
                      }}
                    >
                      <i className="bi bi-clipboard" />
                      {text.copy}
                    </button>
                    {canManage ? (
                      <>
                        <button
                          type="button"
                          className="secret-action"
                          onClick={() => {
                            setActive(secret)
                            setForm({ name: secret.key, value: '' })
                            setMode('edit')
                            void loadValue(secret.id)
                              .then((value) => setForm({ name: secret.key, value }))
                              .catch((error) => {
                                pushToast(error instanceof Error ? error.message : text.revealFail, 'error')
                              })
                          }}
                        >
                          <i className="bi bi-pencil" />
                          {text.edit}
                        </button>
                        <button
                          type="button"
                          className="secret-action danger"
                          onClick={() => {
                            setActive(secret)
                            setMode('delete')
                          }}
                        >
                          <i className="bi bi-trash" />
                          {text.del}
                        </button>
                      </>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
          <Pagination
            compact
            page={paged.page}
            totalPages={paged.totalPages}
            totalItems={paged.totalItems}
            pageSize={paged.pageSize}
            onPageChange={paged.setPage}
          />
        </div>
      )}

      <Modal
        open={mode === 'create' || mode === 'edit'}
        title={mode === 'edit' ? text.editTitle : text.addTitle}
        onClose={close}
        size="sm"
        footer={
          <>
            <button className="btn btn-ghost" type="button" onClick={close}>
              {text.cancel}
            </button>
            <button className="btn btn-secret" type="button" disabled={saving} onClick={() => void save()}>
              {saving ? text.saving : text.save}
            </button>
          </>
        }
      >
        <label className="form-label">{text.name}</label>
        <input
          className="form-control secret-name"
          placeholder={text.namePh}
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <label className="form-label">{text.value}</label>
        <textarea
          className="form-control secret-value"
          rows={4}
          placeholder={text.valuePh}
          value={form.value}
          onChange={(event) => setForm({ ...form, value: event.target.value })}
        />
      </Modal>

      <Modal
        open={mode === 'delete'}
        title={text.deleteTitle}
        onClose={close}
        size="sm"
        footer={
          <>
            <button className="btn btn-ghost" type="button" onClick={close}>
              {text.cancel}
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => {
                if (!active) return
                void deleteSecret(active.id)
                  .then(() => {
                    pushToast(text.deleted, 'info')
                    close()
                  })
                  .catch((error) => {
                    pushToast(error instanceof Error ? error.message : text.deleteFail, 'error')
                  })
              }}
            >
              {text.del}
            </button>
          </>
        }
      >
        <p className="mb-0">{text.deleteBody}</p>
      </Modal>
    </div>
  )
}
