'use client';

import { useState, type FormEvent } from 'react';
import { whatsappUrl } from '@/data/content';
import root from '@/styles/root.module.css';
import s from './ContactBlock.module.css';

export function ContactBlock() {
  const [draftUrl, setDraftUrl] = useState('');
  const [error, setError] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || message.length < 3) {
      setDraftUrl('');
      setError('Mohon isi Nama dan Pesan (minimal 3 karakter).');
      return;
    }
    setError('');
    const url = whatsappUrl(`Halo tim MammaRoti, perkenalkan saya ${name}.\n\nNama: ${name}\nPesan:\n${message}\n\nTerima kasih.`);
    setDraftUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="kontak" className={s.section} aria-labelledby="mr-contact-title">
      <div className={`${root.wrap} ${s.grid}`}>
        <div className={s.copy}>
          <h2 id="mr-contact-title" className={`${root.h2} ${s.title}`}>Kamu punya saran, kritik, atau pertanyaan?</h2>
          <p className={s.text}>Kamu bisa bantu MammaRoti berkembang lebih baik. Sampaikan kritik, saran, dan pertanyaan kamu.</p>
        </div>
        <form className={s.form} onSubmit={onSubmit} onChange={() => { setDraftUrl(''); setError(''); }}>
          <label className={s.field}>
            <span>Nama</span>
            <input name="name" required autoComplete="name" maxLength={100} />
          </label>
          <label className={s.field}>
            <span>Pesan</span>
            <textarea name="message" required minLength={3} maxLength={3000} rows={5} />
          </label>
          <p className={s.hint}>Nama dan pesanmu akan dibuka sebagai draf WhatsApp. Tekan kirim di WhatsApp untuk mengirimkannya.</p>
          <div className={s.actions}>
            <button className={root.btn} type="submit">Kirim via WhatsApp <span aria-hidden="true">↗</span></button>
            {error && <p className={s.status} data-tone="error" role="alert">{error}</p>}
            {draftUrl && <p className={s.status} role="status">Draf WhatsApp siap. Jika belum terbuka, <a href={draftUrl} target="_blank" rel="noopener noreferrer">buka WhatsApp</a>.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
