import { useState } from 'react'
import { FiSend } from 'react-icons/fi'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-border bg-white p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit(e)
          }
        }}
        rows={1}
        placeholder="Ask a question about the retrieved papers…"
        className="input-field max-h-32 resize-none"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()} className="btn-primary h-[42px] px-4">
        <FiSend className="h-4 w-4" />
      </button>
    </form>
  )
}
