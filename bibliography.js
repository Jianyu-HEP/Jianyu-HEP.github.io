/* Shared by the browser and the static-page builder. */
(() => {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sorted = papers => [...papers].sort((a,b) => b.publicationDate.localeCompare(a.publicationDate));
  const journals = [
    {prefix: 'Science', label: 'Science', name: 'Science', color: 'science'},
    {prefix: 'Phys. Rev. Lett.', label: 'PRL', name: 'Physical Review Letters', color: 'prl'},
    {prefix: 'Phys. Rev. D', label: 'PRD', name: 'Physical Review D', color: 'prd'},
    {prefix: 'Phys. Rev. C', label: 'PRC', name: 'Physical Review C', color: 'prc'},
    {prefix: 'Chin. Phys. C', label: 'CPC', name: 'Chinese Physics C', color: 'cpc'},
    {prefix: 'Chin. Phys. Lett.', label: 'CPL', name: 'Chinese Physics Letters', color: 'cpl'}
  ];
  const journalFor = paper => journals.find(j => paper.journal.startsWith(j.prefix));
  function renderAuthors(authors, zh = false) {
    if (authors === 'BESIII Collaboration') return zh ? 'BESIII 合作组' : authors;
    return authors.split(', ').map(name => ['J. Zhang', 'Jianyu Zhang', '张剑宇'].includes(name)
      ? `<strong class="author-self">${escape(name)}</strong>` : escape(name)).join(', ');
  }
  function render(papers, zh = false) {
    const groups = new Map();
    sorted(papers).forEach(p => {
      if (!groups.has(p.year)) groups.set(p.year, []);
      groups.get(p.year).push(p);
    });
    return [...groups].map(([year, entries]) => {
      const articles = entries.map(p => {
      const title = zh ? p.titleZh : p.title;
      const journal = journalFor(p);
      const badge = journal ? `<a class="journal-tag journal-tag--${journal.color}" href="publications.html?journal=${journal.color}" aria-label="${zh?'查看本页所有发表于':'Show all listed papers in'} ${journal.name}">${journal.name}</a>` : '';
      return `<article class="publication"><time class="visually-hidden" datetime="${p.publicationDate}">${p.publicationDate}</time><h3><a class="publication-title-link" href="https://arxiv.org/abs/${p.arxiv}" target="_blank" rel="noopener noreferrer">${escape(title)}</a> ${badge}</h3>${zh?`<p class="publication-original" lang="en">${escape(p.title)}</p>`:''}<p class="publication-authors">${renderAuthors(p.authors, zh)}</p><p class="journal">${escape(p.journal)}</p><div class="publication-links"><a class="publication-journal-link" href="${escape(p.publisherUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${zh?'期刊原文：':'Journal article: '}${escape(title)}">${zh?'期刊原文':'Journal article'} ↗</a><a class="publication-arxiv-link" href="https://arxiv.org/abs/${p.arxiv}" target="_blank" rel="noopener noreferrer" aria-label="arXiv:${p.arxiv}">arXiv ↗</a></div></article>`;
      }).join('\n');
      return `<section class="publication-year" aria-labelledby="year-${year}"><header class="publication-year-heading"><h2 id="year-${year}">${year}</h2><span>${zh?`${entries.length} 篇论文`:`${entries.length} ${entries.length===1?'paper':'papers'}`}</span></header><div class="year-papers">${articles}</div></section>`;
    }).join('\n');
  }
  globalThis.bibliography = {sorted, render, journals, journalFor, renderAuthors};
})();
