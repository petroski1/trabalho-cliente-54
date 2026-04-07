import { useEffect, useState } from 'react'
import { supabase, Review } from '../lib/supabase'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`text-2xl transition-colors ${
            star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300'
          } ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          disabled={!onChange}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function RatingBar({ count, total, label }: { count: number; total: number; label: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-right text-gray-600">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-3">
        <div
          className="bg-yellow-400 h-3 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-gray-500">{count}</span>
    </div>
  )
}

export default function PublicReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  const average =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0

  const countByStar = (star: number) => reviews.filter((r) => r.rating === star).length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Por favor, informe seu nome.')
    if (rating === 0) return setError('Por favor, selecione uma nota.')
    if (!comment.trim()) return setError('Por favor, escreva um comentário.')

    setSubmitting(true)
    const { error: err } = await supabase
      .from('reviews')
      .insert([{ name: name.trim(), rating, comment: comment.trim(), approved: false }])

    setSubmitting(false)
    if (err) {
      setError('Erro ao enviar. Tente novamente.')
    } else {
      setSubmitted(true)
      setName('')
      setRating(0)
      setComment('')
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-military-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="text-4xl">🛡️</div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Loja Militar</h1>
            <p className="text-military-200 text-sm">Avaliações dos clientes</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Resumo */}
        {reviews.length > 0 && (
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo das avaliações</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-military-700">{average.toFixed(1)}</p>
                <StarRating value={Math.round(average)} />
                <p className="text-sm text-gray-500 mt-1">{reviews.length} avaliações</p>
              </div>
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((s) => (
                  <RatingBar
                    key={s}
                    label={`${s} ★`}
                    count={countByStar(s)}
                    total={reviews.length}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Formulário */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Deixe sua avaliação</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-semibold">Avaliação enviada com sucesso!</p>
              <p className="text-sm mt-1">Ela será exibida após aprovação.</p>
              <button
                className="mt-4 text-sm text-green-700 underline"
                onClick={() => setSubmitted(false)}
              >
                Enviar outra avaliação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-military-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nota
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentário
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte sua experiência..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-military-500 resize-none"
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-military-700 hover:bg-military-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </form>
          )}
        </section>

        {/* Lista de avaliações */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {reviews.length > 0 ? 'O que dizem nossos clientes' : ''}
          </h2>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Carregando avaliações...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p>Seja o primeiro a avaliar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800">{r.name}</p>
                      <StarRating value={r.rating} />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        Loja Militar © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
