gsap.registerPlugin(ScrollTrigger);

// 1. Indicador de Progreso de Scroll Vertical
gsap.to("#progressBar", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3
  }
});

// 2. Secuencia de Entrada para la Portada (Hero)
gsap.set("#nav", { opacity: 0, y: -20 });
gsap.set(".headline-small .word > span", { y: "105%" });
gsap.set(".headline-big .letter", { y: 60, opacity: 0 });
gsap.set("#subline", { opacity: 0, y: 20 });

document.querySelectorAll(".card").forEach((card) => {
  const rot = parseFloat(card.dataset.rot) || 0;
  card.dataset.restRot = rot;
  gsap.set(card, { y: -500, rotation: rot + 20, opacity: 0, scale: 0.8 });
});

const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

intro
  .to("#nav", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
  .to(".headline-small .word > span", { y: "0%", duration: 0.9, stagger: 0.08 }, 0.2)
  .to(".headline-big .letter", { y: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: "back.out(1.4)" }, 0.4)
  .to(".card", {
    y: 0, 
    opacity: 1, 
    scale: 1,
    rotation: (i, target) => parseFloat(target.dataset.restRot),
    duration: 1.1, 
    stagger: 0.1, 
    ease: "bounce.out"
  }, 0.6)
  .to("#subline", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");

// 3. Scroll Interactivo y Sincronizado para la Sección "PRESENTE" (Sección 02)
// 3. Scroll Interactivo Pin-Docked para la Sección "PRESENTE" (Sección 02)
const presenteTL = gsap.timeline({
  scrollTrigger: {
    trigger: "#presente",
    start: "top top",      // Inicia cuando la parte superior de la sección toca el techo
    end: "bottom bottom",  // Termina exactamente en el fondo de la sección
    pin: ".sticky-wrapper",// Mantiene fijo el contenedor visual
    scrub: 0.5,            // Suaviza la transición al hacer scroll
  }
});

const metrics = [
  document.getElementById("m1"), 
  document.getElementById("m2"), 
  document.getElementById("m3")
];

const screenTitle = document.querySelector("#techScreen .screen-title");
const screenBody = document.querySelector("#techScreen .screen-body");

presenteTL
  // Estado 1: Balance de Reservas
  .add(() => {
    metrics.forEach(m => m.classList.remove("active"));
    metrics[0].classList.add("active");
    screenTitle.innerText = "Módulo 01: Balance de Reservas";
    screenBody.innerHTML = "Gas: Caída acumulada del 68%.<br>Petróleo: Caída acumulada del 60%.<br>Sostenimiento mediante compresión secundaria en yacimientos maduros.";
  })
  .to({}, { duration: 1 })
  
  // Estado 2: Aporte Nacional
  .add(() => {
    metrics.forEach(m => m.classList.remove("active"));
    metrics[1].classList.add("active");
    screenTitle.innerText = "Módulo 02: Aporte Nacional Real";
    screenBody.innerHTML = "Volumen conjunto (Cuyana, Austral, NOA): ~27k b/d.<br>Cuenca Neuquina: 74% de la matriz.<br>Cese de refinación en Campo Durán por bajo volumen local.";
  })
  .to({}, { duration: 1 })

  // Estado 3: Reversión & Logística
  .add(() => {
    metrics.forEach(m => m.classList.remove("active"));
    metrics[2].classList.add("active");
    screenTitle.innerText = "Módulo 03: Reversión & Logística";
    screenBody.innerHTML = "Gasoducto Norte Revertido (Nov 2024).<br>Flujo invertido: Gas desde Vaca Muerta abastece al NOA.<br>Redistribución de estaciones Refinor activa.";
  })
  .to({}, { duration: 1 });
// 4. Animación de revelado por scroll en las tarjetas históricas y futuras
gsap.utils.toArray(".history-card, .futuro-card").forEach((card) => {
  gsap.from(card, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
});