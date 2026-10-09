'use client';

import { useState, type FormEvent } from 'react';
import { site } from '@/data/site';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [emailHref, setEmailHref] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = { name: String(data.get('name') ?? '').trim(), email: String(data.get('email') ?? '').trim(), message: String(data.get('message') ?? '').trim(), website: String(data.get('website') ?? '') };
    if (!payload.name || !payload.email || !payload.message) { setStatus('Mohon lengkapi Nama, Email, dan Pesan.'); return; }
    setBusy(true); setStatus(''); setEmailHref('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Pesan belum terkirim. Silakan coba lagi.');
      if (result.mode === 'email') {
        const href = `mailto:${site.email}?subject=${encodeURIComponent(`Kritik & Saran — ${payload.name}`)}&body=${encodeURIComponent(`Nama: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`)}`;
        setEmailHref(href);
        window.location.href = href;
        setStatus('Draf email dibuka. Kirim melalui aplikasi email Anda untuk menyelesaikan pengiriman.');
      } else { setStatus('Terima kasih. Pesan kamu sudah terkirim.'); form.reset(); }
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Pesan belum terkirim. Silakan coba lagi.'); }
    finally { setBusy(false); }
  }
  return <form className="contact-form" onSubmit={handleSubmit}>
    <label className="sr-only" htmlFor="contact-name">Nama</label>
    <input id="contact-name" name="name" placeholder="Nama" required autoComplete="name" maxLength={100} />
    <label className="sr-only" htmlFor="contact-email">Email</label>
    <input id="contact-email" name="email" type="email" placeholder="Email" required autoComplete="email" maxLength={254} />
    <label className="sr-only" htmlFor="contact-message">Pesan</label>
    <textarea id="contact-message" name="message" placeholder="Pesan" required minLength={3} maxLength={3000} />
    <div className="honeypot" aria-hidden="true"><label htmlFor="company-website">Website</label><input id="company-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="pill-button" type="submit" disabled={busy}>{busy ? 'Mengirim...' : 'Kirim'}</button>
    {status && <p className="form-status" role="status">{status}{emailHref && <> <a href={emailHref}>Buka draf email</a></>}</p>}
  </form>;
}
