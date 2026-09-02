const progress = document.querySelector('.scroll-progress span');
const navLinks = [...document.querySelectorAll('.top-nav a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function onScroll(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  let active = 0;
  sections.forEach((section,i)=>{ if(section.getBoundingClientRect().top <= 130) active=i; });
  navLinks.forEach((link,i)=>link.classList.toggle('active',i===active));
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

const menuButton=document.querySelector('.menu-button');
const mobileNav=document.querySelector('.mobile-nav');
menuButton.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')==='true';
  menuButton.setAttribute('aria-expanded',String(!open));
  mobileNav.classList.toggle('open',!open);
  mobileNav.setAttribute('aria-hidden',String(open));
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  menuButton.setAttribute('aria-expanded','false');mobileNav.classList.remove('open');mobileNav.setAttribute('aria-hidden','true');
}));

const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -35px'});
reveals.forEach(el=>observer.observe(el));

const lightbox=document.querySelector('.lightbox');
const lightboxImage=lightbox.querySelector('img');
const caption=lightbox.querySelector('.lightbox-caption');
const count=lightbox.querySelector('.lightbox-count');
const prev=lightbox.querySelector('.lightbox-prev');
const next=lightbox.querySelector('.lightbox-next');
let currentGallery=[];
let currentIndex=0;

function renderLightbox(){
  const img=currentGallery[currentIndex];
  if(!img) return;
  lightboxImage.src=img.currentSrc || img.src;
  lightboxImage.alt=img.alt+' — ampliada';
  caption.textContent=img.alt;
  count.textContent=`${currentIndex+1} / ${currentGallery.length}`;
  const one=currentGallery.length<2;
  prev.hidden=one; next.hidden=one;
  prev.disabled=currentIndex===0;
  next.disabled=currentIndex===currentGallery.length-1;
}
function step(dir){
  if(currentGallery.length<2) return;
  const target=currentIndex+dir;
  if(target<0 || target>=currentGallery.length) return;
  currentIndex=target;
  renderLightbox();
}

document.querySelectorAll('.gallery img').forEach(img=>img.addEventListener('click',()=>{
  const gallery=img.closest('.gallery');
  currentGallery=[...gallery.querySelectorAll('img')];
  currentIndex=currentGallery.indexOf(img);
  renderLightbox();
  lightbox.showModal();
}));
prev.addEventListener('click',()=>step(-1));
next.addEventListener('click',()=>step(1));
document.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
document.addEventListener('keydown',e=>{
  if(!lightbox.open) return;
  if(e.key==='ArrowLeft') step(-1);
  if(e.key==='ArrowRight') step(1);
});
let touchStartX=null;
lightbox.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});
lightbox.addEventListener('touchend',e=>{
  if(touchStartX===null) return;
  const dx=e.changedTouches[0].clientX-touchStartX;
  if(Math.abs(dx)>45) step(dx>0?-1:1);
  touchStartX=null;
},{passive:true});


const tourLinks=[...document.querySelectorAll('.tour-nav a')];
const tourSections=tourLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
function updateTourNav(){
  let active=-1;
  tourSections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=145) active=i;});
  tourLinks.forEach((link,i)=>link.classList.toggle('active',i===active));
}
window.addEventListener('scroll',updateTourNav,{passive:true});
updateTourNav();
