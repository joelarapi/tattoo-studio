document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('nav').classList.remove('open');document.querySelector('.menu').setAttribute('aria-expanded','false')}));new IntersectionObserver(entries=>{document.querySelector('.home-mobile-cta').classList.toggle('obscured',entries[0].isIntersecting)},{threshold:.05}).observe(document.querySelector('#tattoo-enquiry'));
document.querySelectorAll('.manual-track').forEach(track=>{const buttons=[...document.querySelectorAll('[data-scroll-target="'+track.id+'"]')];const update=()=>{const max=track.scrollWidth-track.clientWidth;buttons.forEach(button=>button.disabled=Number(button.dataset.direction)<0?track.scrollLeft<2:track.scrollLeft>=max-2)};buttons.forEach(button=>button.addEventListener('click',()=>{const card=track.firstElementChild;const distance=card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);track.scrollBy({left:Number(button.dataset.direction)*distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update()});

const reelDialog=document.querySelector("#reel-dialog");if(reelDialog){document.querySelectorAll("[data-reel]").forEach(button=>button.addEventListener("click",()=>{document.querySelector("#reel-title").textContent=button.dataset.reel;reelDialog.showModal()}));reelDialog.querySelector(".close").addEventListener("click",()=>reelDialog.close());reelDialog.addEventListener("click",e=>{if(e.target===reelDialog)reelDialog.close()})}

// Gentle scroll reveals, local hero parallax and once-only stencil drawing.
(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const revealTargets=[...document.querySelectorAll('.home-section-head,.home-artist-image,.home-artist>div:not(.home-artist-image),.home-visit>div,.home-enquiry .contact-copy,.home-enquiry form,.home-faq>div,.home-final>h2,.home-final>.orange-button,.needle-divider,.home-plan .three-cards article,.home-articles>a,.manual-track>.project,.manual-track>.reel-card')];
 const stencils=[...document.querySelectorAll('.scroll-stencil')];
 let reveals,drawings,frame=0,active=false;
 const hero=document.querySelector('.home-hero');
 const paint=()=>{frame=0;if(!active)return;const rect=hero.getBoundingClientRect();if(rect.bottom<=0||rect.top>innerHeight)return;const distance=Math.max(0,-rect.top);const mobile=innerWidth<=680;hero.style.setProperty('--hero-primary-shift',Math.min(mobile?14:30,distance*.045)+'px');hero.style.setProperty('--hero-secondary-shift',-Math.min(mobile?10:22,distance*.032)+'px')};
 const onScroll=()=>{if(active&&!frame)frame=requestAnimationFrame(paint)};
 const stop=()=>{active=false;reveals?.disconnect();drawings?.disconnect();cancelAnimationFrame(frame);frame=0;revealTargets.forEach(el=>{el.classList.remove('scroll-reveal','is-revealed');el.style.removeProperty('--reveal-delay')});stencils.forEach(svg=>svg.classList.add('stencil-drawn'));hero.style.removeProperty('--hero-primary-shift');hero.style.removeProperty('--hero-secondary-shift')};
 const start=()=>{stop();if(preference.matches||!('IntersectionObserver' in window))return;active=true;
  reveals=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');reveals.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  revealTargets.forEach(el=>{const siblings=el.parentElement.matches('.three-cards,.home-articles,.manual-track')?[...el.parentElement.children]:[];el.style.setProperty('--reveal-delay',Math.max(0,siblings.indexOf(el)%3)*75+'ms');el.classList.add('scroll-reveal');if(el.getBoundingClientRect().bottom<0)el.classList.add('is-revealed');else reveals.observe(el)});
  drawings=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('stencil-drawn');drawings.unobserve(entry.target)}})},{threshold:.15});
  stencils.forEach(svg=>{svg.classList.remove('stencil-drawn');svg.querySelectorAll('path,circle').forEach((line,i)=>{line.setAttribute('pathLength','1');line.style.setProperty('--stroke-delay',Math.min(i*35,210)+'ms');line.classList.add('stencil-line')});drawings.observe(svg)});onScroll();
 };
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});preference.addEventListener('change',start);start();
})();

// Reveal one photograph at a time without interrupting manual browsing.
(()=>{
 const track=document.querySelector('#home-photo-track');if(!track)return;
 const cards=[...track.querySelectorAll('.project')];if(!cards.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,visible=false,resumeAt=0;
 const show=(next,move=false)=>{index=next;cards.forEach((card,i)=>card.classList.toggle('is-colour-active',i===index));if(move){const card=cards[index],left=card.offsetLeft-track.firstElementChild.offsetLeft;if(left<track.scrollLeft||left+card.offsetWidth>track.scrollLeft+track.clientWidth)track.scrollTo({left,behavior:'smooth'})}};
 const pause=()=>{resumeAt=Date.now()+6500};
 ['pointerdown','wheel','keydown','touchstart'].forEach(event=>track.addEventListener(event,pause,{passive:true}));
 document.querySelectorAll('[data-scroll-target="home-photo-track"]').forEach(button=>button.addEventListener('click',pause));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:.15}).observe(track);
 show(0);
 setInterval(()=>{if(reduced.matches||!visible||document.hidden||Date.now()<resumeAt||track.matches(':hover')&&matchMedia('(hover:hover)').matches||track.contains(document.activeElement))return;show((index+1)%cards.length,true)},3500);
})();
