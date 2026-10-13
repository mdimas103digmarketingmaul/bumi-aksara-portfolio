(() => {
  'use strict';

  const ROOT = '/hanasari-website';
  const ARTICLE_JSON = `${ROOT}/content/articles.json`;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const articleURL = slug => `${ROOT}/artikel/detail.html?slug=${encodeURIComponent(slug)}`;
  const normalizedImage = value => {
    if (!value) return `${ROOT}/assets/images/nasi-box-styled.webp`;
    if (/^(https?:)?\/\//.test(value) || value.startsWith('/')) return value;
    return `${ROOT}/${value.replace(/^\.\//, '')}`;
  };

  const formatDate = value => {
    if (!value) return '';
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(date.getTime())) return escapeHTML(value);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const published = article => article && article.status !== 'draft';
  const sortNewest = (a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0);

  const cardHTML = article => `
    <article class="article-card">
      <a class="article-card-media" href="${articleURL(article.slug)}" aria-label="Baca ${escapeHTML(article.title)}">
        <img src="${escapeHTML(normalizedImage(article.thumbnail))}" alt="${escapeHTML(article.thumbnailAlt || article.title)}" loading="lazy">
      </a>
      <div class="article-card-body">
        <div class="article-meta"><span>${escapeHTML(article.category || 'Artikel')}</span><time datetime="${escapeHTML(article.publishDate || '')}">${formatDate(article.publishDate)}</time></div>
        <h3><a href="${articleURL(article.slug)}">${escapeHTML(article.title)}</a></h3>
        <p>${escapeHTML(article.excerpt || '')}</p>
        <a class="article-read" href="${articleURL(article.slug)}">Baca selengkapnya <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;

  const inlineMarkdown = text => escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const renderMarkdown = markdown => {
    const lines = String(markdown || '').replace(/\r/g, '').split('\n');
    let html = '';
    let paragraph = [];
    let list = null;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      html += `<p>${inlineMarkdown(paragraph.join(' '))}</p>`;
      paragraph = [];
    };
    const closeList = () => {
      if (!list) return;
      html += `</${list}>`;
      list = null;
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushParagraph(); closeList(); continue; }
      const heading = line.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        flushParagraph(); closeList();
        const level = heading[1].length;
        html += `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;
        continue;
      }
      const quote = line.match(/^>\s?(.+)$/);
      if (quote) {
        flushParagraph(); closeList();
        html += `<blockquote>${inlineMarkdown(quote[1])}</blockquote>`;
        continue;
      }
      const unordered = line.match(/^[-*]\s+(.+)$/);
      if (unordered) {
        flushParagraph();
        if (list !== 'ul') { closeList(); html += '<ul>'; list = 'ul'; }
        html += `<li>${inlineMarkdown(unordered[1])}</li>`;
        continue;
      }
      const ordered = line.match(/^\d+\.\s+(.+)$/);
      if (ordered) {
        flushParagraph();
        if (list !== 'ol') { closeList(); html += '<ol>'; list = 'ol'; }
        html += `<li>${inlineMarkdown(ordered[1])}</li>`;
        continue;
      }
      paragraph.push(line);
    }
    flushParagraph(); closeList();
    return html;
  };

  const fetchArticles = async () => {
    const response = await fetch(ARTICLE_JSON, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.articles) ? data.articles : [];
  };

  const renderFeatured = articles => {
    const target = $('#featured-articles');
    if (!target) return;
    const featured = articles.filter(article => published(article) && article.featured).sort(sortNewest).slice(0, 3);
    target.innerHTML = featured.map(cardHTML).join('');
    const empty = $('#featured-articles-empty');
    if (empty) empty.hidden = featured.length > 0;
  };

  const renderIndex = articles => {
    const grid = $('#article-list');
    if (!grid) return;
    const all = articles.filter(published).sort(sortNewest);
    const count = $('#article-count');
    if (count) count.textContent = `${all.length} artikel`;

    const paint = category => {
      const shown = category === 'Semua' ? all : all.filter(article => article.category === category);
      grid.innerHTML = shown.map(cardHTML).join('');
      $('#article-empty').hidden = shown.length > 0;
      $$('.article-filter').forEach(button => {
        const active = button.dataset.category === category;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };

    $$('.article-filter').forEach(button => button.addEventListener('click', () => paint(button.dataset.category)));
    paint('Semua');
  };

  const renderDetail = articles => {
    const body = $('#article-body');
    if (!body) return;
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    const article = articles.find(item => published(item) && item.slug === slug);
    const notFound = $('#article-not-found');
    const shell = $('#article-shell');

    if (!article) {
      if (shell) shell.hidden = true;
      if (notFound) notFound.hidden = false;
      return;
    }

    $('#article-category').textContent = article.category || 'Artikel';
    $('#article-date').textContent = formatDate(article.publishDate);
    $('#article-date').dateTime = article.publishDate || '';
    $('#article-title').textContent = article.title || '';
    $('#article-excerpt').textContent = article.excerpt || '';
    const image = $('#article-image');
    image.src = normalizedImage(article.thumbnail);
    image.alt = article.thumbnailAlt || article.title || 'Artikel Hanasari';
    body.innerHTML = renderMarkdown(article.body || '');

    document.title = article.seoTitle || `${article.title} — Hanasari Catering`;
    const description = article.seoDescription || article.excerpt || '';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta); }
    meta.content = description;

    const related = articles.filter(item => published(item) && item.slug !== article.slug && item.category === article.category).sort(sortNewest).slice(0, 3);
    const relatedGrid = $('#related-articles');
    if (relatedGrid) {
      relatedGrid.innerHTML = related.map(cardHTML).join('');
      $('#related-section').hidden = related.length === 0;
    }
  };

  fetchArticles()
    .then(articles => {
      renderFeatured(articles);
      renderIndex(articles);
      renderDetail(articles);
    })
    .catch(error => {
      console.warn('Konten artikel tidak dapat dimuat:', error);
      const featuredEmpty = $('#featured-articles-empty');
      const indexEmpty = $('#article-empty');
      if (featuredEmpty) featuredEmpty.hidden = false;
      if (indexEmpty) indexEmpty.hidden = false;
    });
})();
