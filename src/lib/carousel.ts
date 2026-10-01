/** Wire card photo carousels: arrows, dots, and swipe (native scroll-snap). */
export function wireCarousels(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
    const track = card.querySelector<HTMLElement>('[data-track]');
    if (!track || card.dataset.carousel) return;
    card.dataset.carousel = '1';
    const dots = [...card.querySelectorAll<HTMLElement>('.dots span')];
    const prev = card.querySelector<HTMLButtonElement>('[data-prev]');
    const next = card.querySelector<HTMLButtonElement>('[data-next]');
    const count = track.children.length;
    const index = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (i: number) => track.scrollTo({ left: Math.max(0, Math.min(count - 1, i)) * track.clientWidth });
    const sync = () => {
      const i = index();
      dots.forEach((d, j) => d.classList.toggle('on', i === j));
      if (prev) prev.style.visibility = i === 0 ? 'hidden' : '';
      if (next) next.style.visibility = i >= count - 1 ? 'hidden' : '';
    };
    prev?.addEventListener('click', (e) => { e.preventDefault(); go(index() - 1); });
    next?.addEventListener('click', (e) => { e.preventDefault(); go(index() + 1); });
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    sync();
  });
}
