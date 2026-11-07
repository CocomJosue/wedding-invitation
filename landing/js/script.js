const CONFIG = {
  civil: {name:'Juzgado 51 del Registro Civil', address:'Uxmal 803, Sta Cruz Atoyac, Benito Juárez, 03310 Ciudad de México, CDMX', time:'10:00 a.m.', mapsUrl:'https://maps.app.goo.gl/Sy15BaircD9nTaCh6'},
  reception: {name:'', address:'Miguel Angel 170 Bis, Moderna, Benito Juárez, 03510 Ciudad de México, CDMX', time:'01:30 p.m.', mapsUrl:'https://maps.app.goo.gl/S96aCH7SQkyK2KVn9'},
  whatsappNumber:'5215659865418' // Número con código de país, sin + ni espacios. Ejemplo: 521XXXXXXXXXX. Opcional.
};
// Páginas disponibles: index.html?version=familiar (con reglas de prendas)
// y index.html?version=general (sin reglas de prendas). Colores reservados en ambas.
const setText=(id,value)=>document.getElementById(id).textContent=value;
setText('civil-name',CONFIG.civil.name);setText('civil-address',CONFIG.civil.address);setText('civil-time',CONFIG.civil.time);
setText('party-name',CONFIG.reception.name);setText('party-address',CONFIG.reception.address);setText('party-time',CONFIG.reception.time);
function setupLink(id,url){const a=document.getElementById(id);if(url){a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.classList.remove('is-disabled');a.removeAttribute('aria-disabled')}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true')}}
setupLink('civil-map',CONFIG.civil.mapsUrl);setupLink('party-map',CONFIG.reception.mapsUrl);
const openBtn=document.getElementById('open-invite');const intro=document.getElementById('envelope-screen');
openBtn.addEventListener('click',()=>{intro.classList.add('opening');openBtn.disabled=true;setTimeout(()=>{intro.classList.add('dismissed');document.body.classList.remove('no-scroll')},900)});
const nav=document.getElementById('site-nav');const navBtn=document.getElementById('menu-toggle');
navBtn.addEventListener('click',()=>{const opened=nav.classList.toggle('open');navBtn.setAttribute('aria-expanded',String(opened))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');navBtn.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
function updateCountdown(){const delta=Math.max(0,new Date('2026-12-19T10:00:00-06:00').getTime()-Date.now());setText('days',Math.floor(delta/86400000));setText('hours',String(Math.floor(delta/3600000)%24).padStart(2,'0'));setText('minutes',String(Math.floor(delta/60000)%60).padStart(2,'0'));setText('seconds',String(Math.floor(delta/1000)%60).padStart(2,'0'))}updateCountdown();setInterval(updateCountdown,1000);
const modal=document.getElementById('photo-modal');document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{modal.querySelector('img').src=b.dataset.full;modal.showModal()}));document.getElementById('close-modal').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});

// Música ambiental: inicia únicamente después del clic en «Abrir invitación».
// IMPORTANTE: el archivo de audio no se incluye; añade una copia autorizada en assets/flyMeToTheMoon.mp3.
const weddingAudio=document.getElementById('wedding-audio');
const musicToggle=document.getElementById('music-toggle');
const musicLabel=document.getElementById('music-label');
const musicIcon=document.getElementById('music-icon');
function refreshMusicButton(){
  const playing=!weddingAudio.paused && !weddingAudio.ended;
  musicLabel.textContent=playing?'Pausar música':'Reproducir música';
  musicIcon.textContent=playing?'Ⅱ':'♫';
  musicToggle.setAttribute('aria-label',playing?'Pausar Fly Me To The Moon':'Reproducir Fly Me To The Moon');
  musicToggle.title=playing?'Pausar música':'Fly Me To The Moon';
}
async function playWeddingMusic(){
  musicToggle.hidden=false;
  try {await weddingAudio.play();} catch(error){
    musicLabel.textContent='Agregar canción';
    musicToggle.title='Falta añadir assets/flyMeToTheMoon.mp3';
  }
  refreshMusicButton();
  if(weddingAudio.error){musicLabel.textContent='Agregar canción';musicToggle.title='Falta añadir assets/flyMeToTheMoon.mp3';}
}
// Se invoca desde el gesto de apertura para cumplir las restricciones de los navegadores.
openBtn.addEventListener('click',playWeddingMusic);
musicToggle.addEventListener('click',()=>{
  if(weddingAudio.paused)playWeddingMusic();else weddingAudio.pause();
});
weddingAudio.addEventListener('play',refreshMusicButton);
weddingAudio.addEventListener('pause',refreshMusicButton);
weddingAudio.addEventListener('error',()=>{
  musicToggle.hidden=false;
  musicLabel.textContent='Agregar canción';
  musicToggle.title='Coloca una copia autorizada en assets/flyMeToTheMoon.mp3';
});
document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.getElementById('confirm-button');

    // Obtener el token de la URL
    const token = window.location.pathname
        .split('/')
        .filter(Boolean)[0];
    
    if (!token) {
        confirmButton.classList.add('disabled');
        confirmButton.setAttribute('aria-disabled', 'true');
        return;
    }

    // Redirigir a Angular conservando el token
    confirmButton.href = `/app/i/${encodeURIComponent(token)}`;
});

const token = window.location.pathname
    .split('/')
    .filter(Boolean)[0];

if (!token) {
  document.getElementById('confirmar').style.display = 'none';
  document.getElementById('btnConfirmar').style.display = 'none';
} 
else{
  if(
    token === 'bwcxtherhsbazvgriiwr' ||
    token === 'svizwqrbdbvdoycdxzlm' ||
    token === 'fodcvlajuhnvtkgmdrkd' ||
    token === 'eibuvtedztqfxgsogvwc' ||
    token === 'mwkzrfjvpxnqhtbcygud' ||
    token === 'qjbxnvelkzphwrtfaycm' ||
    token === 'rnpvhyqkzjfxwmtbceug' // TODO: Agregar aquí todos los tokens a los que queramos mostrarles el mensaje
  ) {
    document.querySelector('#family-rules').hidden=false;
  } 
  if( token === 'lmknjbhvqwlmknjbhvqw' || token === 'hwrtfaycmxnqhtbcygud') { // TODO: Agregar aquí todos los tokens a los que queramos ocultarles la ubicación
    document.getElementById('location').style.display = 'none';
  }
}