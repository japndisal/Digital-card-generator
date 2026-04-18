'use client';

import { useState, useRef } from 'react';
import { Sparkles, Copy, Check, Loader2, Mail, Phone, Globe, Download, RotateCcw, FlipHorizontal } from 'lucide-react';

const THEMES = {
  modern: {
    label: 'Modern',
    bg: 'bg-white',
    border: 'border border-slate-200',
    shadow: 'shadow-sm',
    font: 'font-sans',
    name: 'text-slate-900',
    title: 'text-slate-500',
    company: 'text-slate-700',
    tagline: 'text-indigo-600 italic',
    bio: 'text-slate-600',
    divider: 'border-slate-200',
    icon: 'text-slate-400',
    contactText: 'text-slate-700',
    accent: 'bg-indigo-600',
  },
  dreamy: {
    label: 'Dreamy',
    bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    border: '',
    shadow: 'shadow-xl',
    font: 'font-sans',
    name: 'text-white',
    title: 'text-white/80',
    company: 'text-white/90',
    tagline: 'text-white/90 italic',
    bio: 'text-white/85',
    divider: 'border-white/25',
    icon: 'text-white/70',
    contactText: 'text-white/90',
    accent: 'bg-white/25',
  },
  executive: {
    label: 'Executive',
    bg: 'bg-slate-900',
    border: 'border border-slate-700',
    shadow: 'shadow-lg',
    font: 'font-sans',
    name: 'text-white',
    title: 'text-amber-400',
    company: 'text-slate-300',
    tagline: 'text-slate-400 italic',
    bio: 'text-slate-300',
    divider: 'border-slate-700',
    icon: 'text-slate-500',
    contactText: 'text-slate-300',
    accent: 'bg-amber-400',
  },
  editorial: {
    label: 'Editorial',
    bg: 'bg-amber-50',
    border: 'border border-stone-300',
    shadow: 'shadow-sm',
    font: 'font-serif',
    name: 'text-stone-900',
    title: 'text-stone-600',
    company: 'text-stone-700',
    tagline: 'text-stone-700 italic',
    bio: 'text-stone-600',
    divider: 'border-stone-300',
    icon: 'text-stone-500',
    contactText: 'text-stone-700',
    accent: 'bg-stone-900',
  },
};

export default function BusinessCardCreator() {
  const [card, setCard] = useState({
    name: 'Shehan Perera',
    title: 'Full-Stack Developer',
    company: 'Building cool things',
    email: 'shehan@example.com',
    phone: '+1 555 0123',
    website: 'shehan.dev',
    tagline: '',
    bio: '',
  });

  const [theme, setTheme] = useState('modern');
  const [loading, setLoading] = useState({});
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);

  const t = THEMES[theme];

  const update = (field, value) => {
    setCard(prev => ({ ...prev, [field]: value }));
  };

  // Calls our own API route, which proxies to Gemini.
  // The API key lives server-side only — never shipped to the browser.
  const callAI = async (prompt) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || 'AI request failed');
    }
    return data.text;
  };

  const generateTagline = async () => {
    if (!card.title) {
      setError('Add a title first');
      setTimeout(() => setError(''), 2500);
      return;
    }
    setLoading(l => ({ ...l, tagline: true }));
    try {
      const prompt = `Write one short professional tagline (maximum 8 words) for a ${card.title}${card.company ? ` at ${card.company}` : ''}. Be specific and memorable, not generic. Return ONLY the tagline with no quotes or explanation.`;
      update('tagline', await callAI(prompt));
    } catch (e) {
      setError(e.message || 'AI request failed');
      setTimeout(() => setError(''), 2500);
    }
    setLoading(l => ({ ...l, tagline: false }));
  };

  const generateBio = async () => {
    if (!card.title) {
      setError('Add a title first');
      setTimeout(() => setError(''), 2500);
      return;
    }
    setLoading(l => ({ ...l, bio: true }));
    try {
      const prompt = `Write a professional 2-sentence bio for ${card.name || 'this person'}, who is a ${card.title}${card.company ? ` at ${card.company}` : ''}. Keep it warm, human, and concrete — no buzzwords like "passionate" or "leveraging". Return ONLY the bio text.`;
      update('bio', await callAI(prompt));
    } catch (e) {
      setError(e.message || 'AI request failed');
      setTimeout(() => setError(''), 2500);
    }
    setLoading(l => ({ ...l, bio: false }));
  };

  const polishBio = async () => {
    if (!card.bio) {
      setError('Write a bio first, then polish it');
      setTimeout(() => setError(''), 2500);
      return;
    }
    setLoading(l => ({ ...l, polish: true }));
    try {
      const prompt = `Polish this professional bio. Keep it to 2 sentences maximum, remove buzzwords, make it sharper and more human: "${card.bio}". Return ONLY the improved bio text.`;
      update('bio', await callAI(prompt));
    } catch (e) {
      setError(e.message || 'AI request failed');
      setTimeout(() => setError(''), 2500);
    }
    setLoading(l => ({ ...l, polish: false }));
  };

  const copyAsText = () => {
    const text = [
      card.name,
      card.title + (card.company ? ` at ${card.company}` : ''),
      card.tagline && `"${card.tagline}"`,
      '',
      card.email && `Email: ${card.email}`,
      card.phone && `Phone: ${card.phone}`,
      card.website && `Web: ${card.website}`,
      '',
      card.bio,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name}`,
      card.title && `TITLE:${card.title}`,
      card.company && `ORG:${card.company}`,
      card.email && `EMAIL:${card.email}`,
      card.phone && `TEL:${card.phone}`,
      card.website && `URL:${card.website}`,
      card.bio && `NOTE:${card.bio.replace(/\n/g, ' ')}`,
      'END:VCARD',
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(card.name || 'contact').replace(/\s+/g, '-').toLowerCase()}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setTilt({ x: 0, y: 0 });
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: rotation.x,
      baseY: rotation.y,
    };
  };

  const onPointerMove = (e) => {
    if (dragging && dragRef.current) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setRotation({
        x: Math.max(-85, Math.min(85, dragRef.current.baseX - dy * 0.6)),
        y: dragRef.current.baseY + dx * 0.6,
      });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTilt({ x: -py * 8, y: px * 8 });
    }
  };

  const onPointerUp = () => {
    setDragging(false);
    dragRef.current = null;
  };

  const onPointerLeave = () => {
    if (!dragging) setTilt({ x: 0, y: 0 });
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
    setFlipped(false);
  };

  const totalX = rotation.x + tilt.x;
  const totalY = rotation.y + tilt.y + (flipped ? 180 : 0);

  const Field = ({ label, field, placeholder, type = 'text', multiline = false }) => {
    const Input = multiline ? 'textarea' : 'input';
    return (
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
        <Input
          type={type}
          value={card[field]}
          onChange={e => update(field, e.target.value)}
          placeholder={placeholder}
          rows={multiline ? 3 : undefined}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
      </div>
    );
  };

  const AIButton = ({ onClick, loading: isLoading, children }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 rounded-lg transition-colors"
    >
      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Digital Business Card Creator</h1>
          <p className="text-sm text-slate-600 mt-1">Build your card, let AI help with the copy, then download or share.</p>
        </header>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* FORM */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-medium text-slate-900">Your details</h2>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" field="name" placeholder="Jane Smith" />
              <Field label="Title" field="title" placeholder="Product Designer" />
            </div>

            <Field label="Company" field="company" placeholder="Acme Inc." />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600">Tagline</label>
                <AIButton onClick={generateTagline} loading={loading.tagline}>
                  Generate
                </AIButton>
              </div>
              <input
                type="text"
                value={card.tagline}
                onChange={e => update('tagline', e.target.value)}
                placeholder="A short, memorable phrase"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Field label="Email" field="email" placeholder="you@example.com" type="email" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" field="phone" placeholder="+1 555 0123" />
                <Field label="Website" field="website" placeholder="yoursite.com" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600">Bio</label>
                <div className="flex gap-1.5">
                  <AIButton onClick={generateBio} loading={loading.bio}>Generate</AIButton>
                  <AIButton onClick={polishBio} loading={loading.polish}>Polish</AIButton>
                </div>
              </div>
              <textarea
                value={card.bio}
                onChange={e => update('bio', e.target.value)}
                placeholder="A short professional bio..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* PREVIEW */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-medium text-slate-900">Preview</h2>
              <div className="flex gap-1">
                {Object.entries(THEMES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      theme === key
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* The card — 3D rotatable */}
            <div style={{ perspective: '1400px' }} className="py-4">
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerLeave}
                onPointerCancel={onPointerUp}
                className={`relative select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${totalX}deg) rotateY(${totalY}deg)`,
                  transition: dragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  touchAction: 'none',
                  willChange: 'transform',
                  height: '360px',
                }}
              >
                {/* FRONT FACE */}
                <div
                  className={`absolute inset-0 ${t.bg} ${t.border} ${t.shadow} ${t.font} rounded-2xl p-6 flex flex-col`}
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-2xl font-semibold ${t.name} leading-tight truncate`}>
                        {card.name || 'Your name'}
                      </h3>
                      <p className={`text-sm mt-1 ${t.title}`}>
                        {card.title || 'Your title'}
                        {card.company && <span className={t.company}> · {card.company}</span>}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${t.accent} flex items-center justify-center text-white font-semibold text-sm shrink-0 ml-3`}>
                      {(card.name || 'YN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {card.tagline && (
                    <p className={`text-sm mt-3 ${t.tagline}`}>"{card.tagline}"</p>
                  )}

                  <div className={`border-t my-4 ${t.divider}`}></div>

                  <div className="space-y-2 flex-1">
                    {card.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className={`w-4 h-4 ${t.icon} shrink-0`} />
                        <span className={`${t.contactText} truncate`}>{card.email}</span>
                      </div>
                    )}
                    {card.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className={`w-4 h-4 ${t.icon} shrink-0`} />
                        <span className={t.contactText}>{card.phone}</span>
                      </div>
                    )}
                    {card.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className={`w-4 h-4 ${t.icon} shrink-0`} />
                        <span className={`${t.contactText} truncate`}>{card.website}</span>
                      </div>
                    )}
                  </div>

                  <div className={`mt-auto pt-3 text-xs ${t.icon} uppercase tracking-wider`}>Front</div>
                </div>

                {/* BACK FACE */}
                <div
                  className={`absolute inset-0 ${t.bg} ${t.border} ${t.shadow} ${t.font} rounded-2xl p-6 flex flex-col`}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className={`text-6xl font-bold ${t.name} opacity-20 leading-none`}>
                    {(card.name || 'YN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {card.tagline && (
                    <p className={`text-base mt-3 ${t.tagline}`}>"{card.tagline}"</p>
                  )}

                  <div className={`border-t my-4 ${t.divider}`}></div>

                  <p className={`text-sm leading-relaxed ${t.bio} flex-1`}>
                    {card.bio || 'Your bio will appear on the back of the card. Click "Generate" in the form to draft one with AI.'}
                  </p>

                  <div className={`mt-auto pt-3 text-xs ${t.icon} flex items-center justify-between`}>
                    <span className="uppercase tracking-wider">Back</span>
                    <span className="font-mono">{card.website || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D controls */}
            <div className="flex items-center justify-between px-1 mb-2 text-xs text-slate-500">
              <span>Drag to rotate · hover tilts</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFlipped(f => !f)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-slate-400 transition-colors"
                  title="Flip the card"
                >
                  <FlipHorizontal className="w-3 h-3" />
                  Flip
                </button>
                <button
                  onClick={resetRotation}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-slate-400 transition-colors"
                  title="Reset rotation"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* Export buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={copyAsText}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy as text'}
              </button>
              <button
                onClick={downloadVCard}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download .vcf
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              The <code className="px-1 py-0.5 bg-slate-100 rounded">.vcf</code> file imports straight into any phone's contacts app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
