const CONFIG = {
  civil: {name:'Juzgado 51 del Registro Civil', address:'Uxmal 803, Sta Cruz Atoyac, Benito Juárez, 03310 Ciudad de México, CDMX', time:'10:00 a.m.', mapsUrl:'https://maps.app.goo.gl/Sy15BaircD9nTaCh6'},
  reception: {name:'', address:'Miguel Angel 170 Bis, Moderna, Benito Juárez, 03510 Ciudad de México, CDMX', time:'01:30 p.m.', mapsUrl:'https://maps.app.goo.gl/S96aCH7SQkyK2KVn9'},
  whatsappNumber:'5215659865418' // Número con código de país, sin + ni espacios. Ejemplo: 521XXXXXXXXXX. Opcional.
};
// Páginas disponibles: index.html?version=familiar (con reglas de prendas)
// y index.html?version=general (sin reglas de prendas). Colores reservados en ambas.
const variant = window.INVITE_VARIANT || (new URLSearchParams(location.search).get('version') === 'general' ? 'general' : 'familiar');
if (variant==='general') document.querySelector('#family-rules').hidden=true;
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
// Formulario de confirmación: prepara la respuesta sin guardarla en servidores.
const rsvp=document.getElementById('rsvp-form');
const guestRow=document.getElementById('guest-row');
rsvp.querySelectorAll('input[name="attending"]').forEach(r=>r.addEventListener('change',()=>{
  guestRow.hidden=rsvp.querySelector('input[name="attending"]:checked').value!=='Sí, asistiré';
}));
rsvp.addEventListener('submit', async ev=>{
  ev.preventDefault();
  const d=new FormData(rsvp);
  const going=d.get('attending')==='Sí, asistiré';
  const msg=`Confirmación de boda — Fabiola y Josué\nNombre: ${d.get('name')}\nAsistencia: ${d.get('attending')}${going?'\nNúmero de asistentes: '+d.get('guests'):''}${d.get('message')?'\nMensaje: '+d.get('message'):''}`;
  const help=document.getElementById('rsvp-help');
  if(CONFIG.whatsappNumber && /^\d{10,15}$/.test(CONFIG.whatsappNumber)){
    window.open('https://wa.me/'+CONFIG.whatsappNumber+'?text='+encodeURIComponent(msg),'_blank','noopener');
    help.textContent='Se abrió WhatsApp. Envía el mensaje para terminar de confirmar.';
    return;
  }
  if(navigator.share){
    try { await navigator.share({title:'Confirmación de asistencia',text:msg}); help.textContent='Envía la respuesta a los novios para confirmar.'; return; }
    catch(e){if(e.name==='AbortError') return;}
  }
  try {await navigator.clipboard.writeText(msg);help.textContent='¡Respuesta copiada! Pégala en WhatsApp y envíala a los novios.';}
  catch(e){help.textContent=msg+' — Copia este texto y envíalo a los novios.';}
});

// Música ambiental: inicia únicamente después del clic en «Abrir invitación».
// IMPORTANTE: el archivo de audio no se incluye; añade una copia autorizada en assets/brillas.mp3.
const weddingAudio=document.getElementById('wedding-audio');
const musicToggle=document.getElementById('music-toggle');
const musicLabel=document.getElementById('music-label');
const musicIcon=document.getElementById('music-icon');
function refreshMusicButton(){
  const playing=!weddingAudio.paused && !weddingAudio.ended;
  musicLabel.textContent=playing?'Pausar música':'Reproducir música';
  musicIcon.textContent=playing?'Ⅱ':'♫';
  musicToggle.setAttribute('aria-label',playing?'Pausar Brillas de León Larregui':'Reproducir Brillas de León Larregui');
  musicToggle.title=playing?'Pausar música':'Brillas · León Larregui';
}
async function playWeddingMusic(){
  musicToggle.hidden=false;
  try {await weddingAudio.play();} catch(error){
    musicLabel.textContent='Agregar canción';
    musicToggle.title='Falta añadir assets/brillas.mp3';
  }
  refreshMusicButton();
  if(weddingAudio.error){musicLabel.textContent='Agregar canción';musicToggle.title='Falta añadir assets/brillas.mp3';}
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
  musicToggle.title='Coloca una copia autorizada en assets/brillas.mp3';
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