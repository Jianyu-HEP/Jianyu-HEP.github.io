(() => {
  const oldSections = {home:'index.html',research:'research.html',publications:'publications.html',talks:'talks.html',about:'about.html',contact:'about.html#contact',edm:'edm.html',cp:'cp.html',charm:'charm.html'};
  const isHomepage = location.pathname.endsWith('/') || location.pathname.endsWith('/index.html');
  const oldTarget = oldSections[location.hash.slice(1)];
  if (isHomepage && oldTarget) { location.replace(oldTarget); return; }
  const zh = document.documentElement.lang === 'zh-CN';
  const list = document.querySelector('#publication-list');
  if (list && window.selectedPublications && window.bibliography) {
    const count = document.querySelector('#publication-count');
    const filters = [...document.querySelectorAll('[data-filter]')];
    const journalStatus = document.querySelector('#journal-filter-status');
    const requestedJournal = new URLSearchParams(location.search).get('journal');
    let selectedJournal = window.bibliography.journals.find(j => j.color === requestedJournal);
    function render(topic) {
      const papers = window.selectedPublications.filter(p => (topic === 'all' || p.topic === topic)
        && (!selectedJournal || window.bibliography.journalFor(p)?.color === selectedJournal.color));
      list.innerHTML = window.bibliography.render(papers, zh);
      count.textContent = zh ? `共 ${papers.length} 篇论文` : `${papers.length} papers`;
      journalStatus.hidden = !selectedJournal;
      journalStatus.querySelector('span').textContent = selectedJournal ? `${zh ? '当前期刊：' : 'Journal: '}${selectedJournal.name}` : '';
      document.querySelectorAll('.language-switch a').forEach(a => {
        const url = new URL(a.href);
        if (selectedJournal) url.searchParams.set('journal', selectedJournal.color);
        else url.searchParams.delete('journal');
        a.href = url.href;
      });
    }
    document.querySelector('#publication-controls').hidden = false;
    filters.forEach(button => button.addEventListener('click', () => {
      selectedJournal = undefined;
      const url = new URL(location.href);
      url.searchParams.delete('journal');
      history.replaceState(null, '', url);
      filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      render(button.dataset.filter);
    }));
    render('all');
  }
  const printButton = document.querySelector('#print-cv');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }
})();
