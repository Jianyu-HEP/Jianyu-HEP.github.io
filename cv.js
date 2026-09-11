(() => {
  const list = document.querySelector('#cv-publications');
  if (!list || !window.selectedPublications || list.children.length) return;
  const zh = document.documentElement.lang === 'zh-CN';
  list.replaceChildren();
  window.selectedPublications.forEach(p => {
    const item = document.createElement('li');
    const authors = zh && p.authors === 'BESIII Collaboration' ? 'BESIII 合作组' : p.authors;
    item.append(`${authors}. “${zh ? p.titleZh : p.title}.” ${p.journal}. `);
    const link = document.createElement('a');
    link.href = 'https://arxiv.org/abs/' + p.arxiv;
    link.textContent = 'arXiv:' + p.arxiv;
    item.append(link);
    list.append(item);
  });
})();
