import { useEffect, useState } from 'react'
import { supabase, Review } from '../lib/supabase'

const products = [
  { id: 1, name: 'Camiseta Tática', price: 'R$ 89,90', tag: 'Mais vendido', emoji: '👕', desc: 'Tecido respirável, corte moderno, diversas cores.' },
  { id: 2, name: 'Calça Cargo Militar', price: 'R$ 149,90', tag: 'Novidade', emoji: '👖', desc: 'Multi-bolsos, tecido reforçado, elástico na cintura.' },
  { id: 3, name: 'Colete Tático', price: 'R$ 199,90', tag: '', emoji: '🦺', desc: 'Leve, ajustável, ideal para uso diário ou treinos.' },
  { id: 4, name: 'Boné Militar', price: 'R$ 59,90', tag: '', emoji: '🧢', desc: 'Aba curva, velcro traseiro, bordado exclusivo.' },
  { id: 5, name: 'Jaqueta Camuflada', price: 'R$ 249,90', tag: 'Destaque', emoji: '🧥', desc: 'Impermeável, forro interno, vários bolsos.' },
  { id: 6, name: 'Bota Militar', price: 'R$ 319,90', tag: '', emoji: '🥾', desc: 'Couro legítimo, sola antiderrapante, cano médio.' },
]

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hov, setHov] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHov(s)}
          onMouseLeave={() => onChange && setHov(0)}
          className={`text-xl transition-all ${s <= (hov||value) ? 'text-amber-400' : 'text-gray-300'} ${onChange ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
          disabled={!onChange}>★</button>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { loadReviews() }, [])

  async function loadReviews() {
    const { data } = await supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false })
    setReviews(data ?? [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!name.trim()) return setFormError('Informe seu nome.')
    if (rating === 0) return setFormError('Selecione uma nota.')
    if (!comment.trim()) return setFormError('Escreva um comentário.')
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert([{ name: name.trim(), rating, comment: comment.trim(), approved: false }])
    setSubmitting(false)
    if (error) return setFormError('Erro ao enviar. Tente novamente.')
    setSubmitted(true); setName(''); setRating(0); setComment('')
  }

  const avg = reviews.length > 0 ? reviews.reduce((a,r) => a+r.rating, 0)/reviews.length : 0
  const countByStar = (s: number) => reviews.filter(r => r.rating === s).length

  const navLinks = ['Início','Produtos','Sobre','Avaliações','Contato']

  return (
    <div className="font-sans text-gray-800">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1a2410]/90 border-b border-white/10 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">🛡️</div>
            <span className="text-white font-bold text-lg tracking-wide">Loja <span className="text-amber-400">Militar</span></span>
          </a>
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <li key={l}><a href={`#${l.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace('ç','c')}`} className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">{l}</a></li>
            ))}
          </ul>
          <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer"
            className="hidden md:flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#1a2410] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5">
            📱 WhatsApp
          </a>
          <button className="md:hidden text-white text-2xl p-1" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#1a2410] border-t border-white/10 px-6 py-4 space-y-1">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-[#1a2410]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-900/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2d3a1a]/50 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#6b7c3a 0,#6b7c3a 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <div className="relative max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Qualidade &amp; Resistência
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6">
              Roupas<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Militares</span><br/>de Elite
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              Equipamentos táticos e militares para quem exige resistência, estilo e funcionalidade no dia a dia.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#produtos" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#1a2410] font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/30 hover:-translate-y-1 hover:shadow-amber-500/50 text-sm">
                Ver Produtos →
              </a>
              <a href="#avaliacoes" className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:bg-white/5 text-sm">
                Ver Avaliações
              </a>
            </div>
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
              {[['500+','Clientes'],['100+','Produtos'],['4.9★','Avaliação']].map(([n,l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-white">{n}</p>
                  <p className="text-xs text-gray-500 font-medium">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#2d3a1a] to-[#1a2410] border border-white/10 flex items-center justify-center shadow-2xl">
                <span className="text-[160px]">🪖</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-500 text-[#1a2410] font-black text-sm px-4 py-2 rounded-2xl shadow-xl rotate-6">
                Frete Grátis!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#2d3a1a] border border-white/20 text-white text-sm px-4 py-3 rounded-2xl shadow-xl">
                🚚 Entrega em 3 dias
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs">
          <span>Role para baixo</span>
          <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="produtos" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">Catálogo</span>
            <h2 className="text-4xl font-black text-[#1a2410] mt-2 mb-4">Nossos Produtos</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Peças selecionadas com qualidade e resistência para qualquer situação</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2">
                <div className="relative bg-gradient-to-br from-[#2d3a1a] to-[#4a5c2a] h-52 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'12px 12px'}} />
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl">{p.emoji}</span>
                  {p.tag && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-[#1a2410] font-black text-xs px-3 py-1.5 rounded-full shadow-lg">
                      {p.tag}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{p.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">A partir de</p>
                      <p className="text-2xl font-black text-[#2d3a1a]">{p.price}</p>
                    </div>
                    <button className="bg-[#2d3a1a] hover:bg-[#1a2410] text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all hover:shadow-lg hover:shadow-[#2d3a1a]/30 active:scale-95">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">Mais de <span className="font-bold text-[#2d3a1a]">100 produtos</span> disponíveis — entre em contato para o catálogo completo</p>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-24 bg-[#1a2410] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {['🪖','🎽','👢','🦺'].map((e,i) => (
                <div key={i} className={`bg-[#2d3a1a] border border-white/10 rounded-3xl p-8 flex items-center justify-center text-6xl hover:bg-[#3d4d22] transition-colors ${i===1?'mt-8':''}`}>
                  {e}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-[#1a2410] font-black text-sm px-6 py-4 rounded-3xl shadow-2xl">
              ✓ +5 anos de experiência
            </div>
          </div>
          <div>
            <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">Sobre nós</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-6">Tradição e<br/>Qualidade Militar</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Somos especializados em roupas e equipamentos militares de alta qualidade. Nossa missão é oferecer produtos resistentes e funcionais para militares, profissionais de segurança e entusiastas.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Com anos de experiência, garantimos produtos originais, atendimento personalizado e entrega rápida para todo o Brasil.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['✅','Produtos originais'],
                ['🚚','Entrega nacional'],
                ['💬','Suporte dedicado'],
                ['🔄','Troca garantida'],
              ].map(([icon,txt]) => (
                <div key={txt} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <span className="text-lg">{icon}</span>
                  <span className="text-gray-300 text-sm font-medium">{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section id="avaliacoes" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-4xl font-black text-[#1a2410] mt-2 mb-4">O que dizem nossos clientes</h2>
            <p className="text-gray-400">Avaliações reais de clientes verificados</p>
          </div>

          {reviews.length > 0 && (
            <div className="bg-gradient-to-br from-[#1a2410] to-[#2d3a1a] rounded-3xl p-8 mb-12 text-white">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="text-center shrink-0">
                  <p className="text-7xl font-black text-amber-400">{avg.toFixed(1)}</p>
                  <Stars value={Math.round(avg)} />
                  <p className="text-gray-400 text-sm mt-2">{reviews.length} avaliações</p>
                </div>
                <div className="flex-1 w-full space-y-3">
                  {[5,4,3,2,1].map(s => {
                    const pct = reviews.length > 0 ? (countByStar(s)/reviews.length)*100 : 0
                    return (
                      <div key={s} className="flex items-center gap-3 text-sm">
                        <span className="w-8 text-right text-amber-400 font-bold">{s}★</span>
                        <div className="flex-1 bg-white/10 rounded-full h-2.5">
                          <div className="bg-amber-400 h-2.5 rounded-full transition-all" style={{width:`${pct}%`}} />
                        </div>
                        <span className="w-6 text-gray-400 text-xs">{countByStar(s)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Formulário */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h3 className="font-black text-xl text-[#1a2410] mb-2">Avalie sua compra</h3>
              <p className="text-gray-400 text-sm mb-6">Sua opinião ajuda outros clientes!</p>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">✅</div>
                  <p className="font-bold text-gray-800 text-lg">Obrigado pela avaliação!</p>
                  <p className="text-gray-400 text-sm mt-1 mb-6">Será exibida após aprovação da loja.</p>
                  <button onClick={() => setSubmitted(false)} className="text-sm text-[#2d3a1a] font-semibold underline underline-offset-2">Enviar outra avaliação</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Seu nome</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João Silva"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d3a1a] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nota</label>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <Stars value={rating} onChange={setRating} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Comentário</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Conte sua experiência com o produto..." rows={4}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d3a1a] focus:border-transparent resize-none transition-all" />
                  </div>
                  {formError && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{formError}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full bg-[#1a2410] hover:bg-[#2d3a1a] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 active:scale-[0.99]">
                    {submitting ? 'Enviando...' : 'Enviar avaliação ✓'}
                  </button>
                </form>
              )}
            </div>

            {/* Lista */}
            <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
                  <p className="text-5xl mb-4">💬</p>
                  <p className="font-bold text-gray-700">Nenhuma avaliação ainda</p>
                  <p className="text-gray-400 text-sm mt-1">Seja o primeiro a avaliar!</p>
                </div>
              ) : reviews.map(r => (
                <div key={r.id} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2d3a1a] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                        <Stars value={r.rating} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{formatDate(r.created_at)}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed pl-13">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">Fale conosco</span>
            <h2 className="text-4xl font-black text-[#1a2410] mt-2 mb-4">Entre em Contato</h2>
            <p className="text-gray-400">Estamos prontos para atender você</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon:'📱', title:'WhatsApp', desc:'(XX) XXXXX-XXXX', sub:'Seg–Sáb, 8h–18h', color:'from-green-400 to-green-600' },
              { icon:'📍', title:'Endereço', desc:'Sua cidade, Estado', sub:'Visite nossa loja', color:'from-blue-400 to-blue-600' },
              { icon:'📸', title:'Instagram', desc:'@lojamilitar', sub:'Siga para novidades', color:'from-pink-400 to-purple-600' },
            ].map(c => (
              <div key={c.title} className="group bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 cursor-pointer">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {c.icon}
                </div>
                <p className="font-black text-gray-900 text-lg">{c.title}</p>
                <p className="text-[#2d3a1a] font-bold text-sm mt-1">{c.desc}</p>
                <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f1a08] text-gray-500 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-sm">🛡️</div>
            <span className="text-white font-bold">Loja Militar</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Loja Militar. Todos os direitos reservados.</p>
          <a href="/admin" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Área administrativa</a>
        </div>
      </footer>
    </div>
  )
}
