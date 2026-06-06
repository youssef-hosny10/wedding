import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const h = React.createElement;
const RSVP_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdj2nV5WhxTD3rOfWgEqQSYA3llViY_ETFsgMb74E9EtYpRjA/viewform';
const MAP_URL = 'https://maps.app.goo.gl/aHEUKVNv4LNvgjwM8?g_st=iw';
const WEDDING_TIME = new Date('2026-07-23T19:00:00+03:00').getTime();
const ENVELOPE_KEY = 'yd-envelope-v4-opened';

function Floral() {
  const leaves = ['#d9e1c9', '#b5c49a', '#8ea36b', '#758952'];
  const flowers = [[95,236,52,'#f9f5ee'],[138,188,60,'#f7f1ea'],[196,142,56,'#E8C0C5'],[236,102,48,'#F4E2E4'],[72,276,42,'#E8C0C5']];
  return h('svg', { viewBox: '0 0 360 360', className: 'floral', 'aria-hidden': 'true' },
    h('g', { opacity: '.95' },
      leaves.map((color, index) => h('ellipse', { key: index, cx: 128 + index * 34, cy: 92 + index * 26, rx: 14 + index * 3, ry: 50 - index * 3, fill: color, opacity: .48, transform: `rotate(${120 + index * 18} ${128 + index * 34} ${92 + index * 26})` })),
      h('path', { d: 'M55 280 C115 196 150 154 298 74', fill: 'none', stroke: '#758952', strokeWidth: '3', strokeLinecap: 'round', opacity: '.42' }),
      h('path', { d: 'M76 300 C130 226 184 166 320 102', fill: 'none', stroke: '#B5C49A', strokeWidth: '2', strokeLinecap: 'round', opacity: '.52' }),
      flowers.map(([cx, cy, r, color], i) => h('g', { key: i, transform: `translate(${cx} ${cy})` },
        Array.from({ length: 9 }).map((_, p) => h('ellipse', { key: p, cx: 0, cy: -r * .28, rx: r * .22, ry: r * .43, fill: color, opacity: p % 2 ? .82 : .96, transform: `rotate(${p * 40})` })),
        h('circle', { r: r * .18, fill: '#BD9452', opacity: '.42' })
      ))
    )
  );
}

function Envelope({ onDone }) {
  const [opening, setOpening] = useState(false);
  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    sessionStorage.setItem(ENVELOPE_KEY, 'true');
    window.setTimeout(onDone, 1550);
  };
  return h('div', { className: `envelope-cover ${opening ? 'is-opening' : ''}` },
    h('div', { className: 'envelope-scene', 'aria-hidden': 'true' },
      h('div', { className: 'env-base' }), h('div', { className: 'env-emboss' }), h('div', { className: 'env-fold-top' }), h('div', { className: 'env-fold-left' }), h('div', { className: 'env-fold-right' }), h('div', { className: 'env-fold-bottom' }), h('span', { className: 'env-fold-line-left' }), h('span', { className: 'env-fold-line-right' })
    ),
    h('button', { type: 'button', className: 'envelope-button', onClick: openEnvelope, 'aria-label': 'Open Youssef and Donia wedding invitation' },
      h('span', { className: 'wax-seal' }, h('span', { className: 'monogram' }, 'Y&D')),
      h('span', { className: 'tap-open-text' }, 'TAP TO OPEN')
    )
  );
}

function useCountdown() {
  const [remaining, setRemaining] = useState(null);
  useEffect(() => { const tick = () => setRemaining(Math.max(0, WEDDING_TIME - Date.now())); tick(); const id = window.setInterval(tick, 1000); return () => window.clearInterval(id); }, []);
  return useMemo(() => {
    const value = remaining ?? 0;
    const days = Math.floor(value / 86400000);
    const hours = Math.floor((value % 86400000) / 3600000);
    const minutes = Math.floor((value % 3600000) / 60000);
    const seconds = Math.floor((value % 60000) / 1000);
    return [['Days', days], ['Hours', hours], ['Minutes', minutes], ['Seconds', seconds]].map(([label, value]) => ({ label, value: remaining === null ? '--' : String(value).padStart(2, '0') }));
  }, [remaining]);
}

function CountdownStrip() {
  const parts = useCountdown();
  const children = [];
  parts.forEach((part, index) => {
    children.push(h('div', { key: part.label, className: 'count-unit' }, h('span', { className: 'count-number' }, part.value), h('span', { className: 'count-label' }, part.label)));
    if (index < parts.length - 1) children.push(h('div', { key: `sparkle-${part.label}`, className: 'count-sparkle', 'aria-hidden': 'true' }, '✦'));
  });
  return h('div', { className: 'countdown-strip' }, children);
}

function CountdownPanel() {
  return h('section', { className: 'countdown-panel', 'aria-labelledby': 'countdown-title' }, h('h2', { id: 'countdown-title', className: 'countdown-heading' }, 'Countdown'), h('p', { className: 'countdown-subtitle' }, 'To the big day'), h(CountdownStrip));
}

function ExternalButton({ href, children, variant = 'filled' }) {
  const buttonClass = variant === 'filled' ? 'luxury-btn' : 'luxury-btn-outline';
  return h('a', { href, target: '_blank', rel: 'noopener noreferrer', className: `btn-focus luxury-link ${buttonClass}` }, children);
}

function DetailCard({ title, subtitle, text, children }) {
  return h('article', { className: 'rounded-[1.7rem] border border-wedding-gold/25 bg-white/65 p-6 text-center shadow-soft backdrop-blur sm:p-7' },
    h('p', { className: 'font-serif text-[.68rem] font-semibold uppercase tracking-[.28em] text-wedding-ink' }, subtitle),
    h('h3', { className: 'mt-3 font-serif text-xl font-semibold uppercase tracking-[.18em] text-wedding-ink' }, title),
    h('p', { className: 'mx-auto mt-4 min-h-16 max-w-xs text-sm leading-7 text-wedding-ink/75' }, text),
    h('div', { className: 'mt-6 flex justify-center' }, children)
  );
}

function InvitationCard() {
  const details = [['Date', 'Thursday, 23 July 2026'], ['Time', '7:00 PM'], ['Venue', 'Ziya by Azha']];
  return h('section', { className: 'paper-line relative mb-6 overflow-hidden rounded-[1.8rem] border border-wedding-gold/60 bg-[#fffef8] px-7 py-28 text-center shadow-luxury sm:px-16 sm:py-36' },
    h('div', { className: 'floral-tl' }, h(Floral)), h('div', { className: 'floral-br' }, h(Floral)),
    h('div', { className: 'relative z-10 mx-auto max-w-2xl' },
      h('p', { className: 'font-serif text-xs font-semibold uppercase tracking-[.3em] text-wedding-olive' }, 'Together with their families'),
      h('h2', { className: 'script-name my-7 text-[4.6rem] leading-[.9] text-wedding-olive sm:text-[7.4rem]' }, 'Youssef & Donia'),
      h('p', { className: 'mx-auto max-w-xl text-base leading-8 text-wedding-ink/70 sm:text-lg' }, 'request the pleasure of your company as they celebrate their wedding day.'),
      h('div', { className: 'mx-auto my-8 h-px w-64 max-w-[70%] bg-gradient-to-r from-transparent via-wedding-gold to-transparent' }),
      h('dl', { className: 'mx-auto grid max-w-lg gap-5 text-left' }, details.map(([label, value]) => h('div', { key: label, className: 'grid grid-cols-[80px_1fr] gap-4 font-serif text-sm uppercase tracking-[.12em] text-wedding-ink sm:text-base' }, h('dt', { className: 'text-xs font-semibold tracking-[.2em] text-wedding-olive' }, label), h('dd', { className: 'm-0' }, value)))) ,
      h('div', { className: 'mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row' }, h(ExternalButton, { href: RSVP_URL }, 'RSVP Now'), h(ExternalButton, { href: MAP_URL, variant: 'outline' }, 'Navigate'))
    )
  );
}

function Hero() {
  return h('section', { className: 'hero-photo mb-6 p-7 sm:p-12', 'aria-label': 'Wedding hero photo' },
    h('div', { className: 'relative z-10 max-w-2xl pb-3 text-white drop-shadow-[0_8px_18px_rgba(0,0,0,.38)]' }, h('p', { className: 'font-serif text-xs font-semibold uppercase tracking-[.38em]' }, 'The Wedding of'), h('h1', { className: 'script-name mt-4 text-[5.1rem] leading-[.86] sm:text-[7.4rem] lg:text-[8.8rem]' }, 'Youssef & Donia'))
  );
}

function Details() {
  return h(React.Fragment, null,
    h('section', { className: 'details-intro', 'aria-labelledby': 'details-title' }, h('h2', { id: 'details-title', className: 'day-heading' }, 'Day Details'), h('p', { className: 'day-subtitle' }, 'Everything you need to know')),
    h('section', { className: 'mb-6 grid gap-4 lg:grid-cols-3' },
      h(DetailCard, { title: 'Wedding Day', subtitle: 'When', text: 'Thursday, 23 July 2026 at 7:00 PM. Please arrive a little early so the evening can begin beautifully.' }, h(ExternalButton, { href: RSVP_URL }, 'Confirm')),
      h(DetailCard, { title: 'Ziya by Azha', subtitle: 'Venue', text: 'Ceremony and celebration will take place at the same venue.' }, h(ExternalButton, { href: MAP_URL, variant: 'outline' }, 'Open Map')),
      h(DetailCard, { title: 'RSVP', subtitle: 'Response', text: 'Responses are saved in Google Forms so we can prepare your place with love.' }, h(ExternalButton, { href: RSVP_URL }, 'Open RSVP'))
    )
  );
}

function App() {
  const [showEnvelope, setShowEnvelope] = useState(false);
  useEffect(() => { setShowEnvelope(sessionStorage.getItem(ENVELOPE_KEY) !== 'true'); }, []);
  return h(React.Fragment, null,
    showEnvelope && h(Envelope, { onDone: () => setShowEnvelope(false) }),
    h('main', { className: 'page-shell' }, h(Hero), h(InvitationCard), h(CountdownPanel), h(Details), h('aside', { className: 'mb-8 rounded-full border border-wedding-dustyPink/70 bg-wedding-palePink/80 px-6 py-5 text-center text-sm leading-7 text-wedding-ink/75 shadow-soft sm:text-base' }, "We adore your children, but for one night we'd like to see what you all look like without them. Adults only, please. 🤍"), h('footer', { className: 'pb-5 text-center' }, h('p', { className: 'script-name text-5xl text-wedding-olive' }, 'Youssef & Donia'), h('p', { className: 'mt-2 font-serif text-xs uppercase tracking-[.28em] text-wedding-ink/55' }, '23.07.2026')))
  );
}

createRoot(document.getElementById('root')).render(h(App));
