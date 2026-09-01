gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // 1. INDICADOR DE PROGRESO DE SCROLL
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

  // 2. SECUENCIA DE ENTRADA HERO
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

  // 3. SCROLL INTERACTIVO SECCIÓN PRESENTE (PINNED)
  const presenteTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#presente",
      start: "top top",
      end: "bottom bottom",
      pin: ".sticky-wrapper",
      scrub: 0.5,
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
    .add(() => {
      metrics.forEach(m => m.classList.remove("active"));
      metrics[0].classList.add("active");
      screenTitle.innerText = "Módulo 01: Balance de Reservas";
      screenBody.innerHTML = "Gas: Caída acumulada del 68%.<br>Petróleo: Caída acumulada del 60%.<br>Sostenimiento mediante compresión secundaria en yacimientos maduros.";
    })
    .to({}, { duration: 1 })
    .add(() => {
      metrics.forEach(m => m.classList.remove("active"));
      metrics[1].classList.add("active");
      screenTitle.innerText = "Módulo 02: Aporte Nacional Real";
      screenBody.innerHTML = "Volumen conjunto (Cuyana, Austral, NOA): ~27k b/d.<br>Cuenca Neuquina: 74% de la matriz.<br>Cese de refinación en Campo Durán por bajo volumen local.";
    })
    .to({}, { duration: 1 })
    .add(() => {
      metrics.forEach(m => m.classList.remove("active"));
      metrics[2].classList.add("active");
      screenTitle.innerText = "Módulo 03: Reversión & Logística";
      screenBody.innerHTML = "Gasoducto Norte Revertido (Nov 2024).<br>Flujo invertido: Gas desde Vaca Muerta abastece al NOA.<br>Redistribución de estaciones Refinor activa.";
    })
    .to({}, { duration: 1 });

  // 4. MAPA TOPOGRÁFICO LEAFLET (OPENTOPO)
  const mapElement = document.getElementById('map');
  if (mapElement) {
    const map = L.map('map').setView([-22.500, -63.800], 8);

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors',
      maxZoom: 17
    }).addTo(map);

    const yacimientos = [
      { nombre: "Yacimiento Aguaragüe", lat: -22.450, lng: -63.750, provincia: "Salta", operador: "Tecpetrol / YPF", reservorio: "Huamampampa / Santa Rosa", profundidad: "4.200 - 5.100 m" },
      { nombre: "Yacimiento Ramos", lat: -22.580, lng: -63.900, provincia: "Salta", operador: "Pluspetrol", reservorio: "Huamampampa", profundidad: "4.500 - 5.400 m" },
      { nombre: "Yacimiento Acambuco", lat: -22.310, lng: -63.680, provincia: "Salta", operador: "Pan American Energy", reservorio: "Huamampampa (Profundo)", profundidad: "4.800 - 5.600 m" },
      { nombre: "Yacimiento Caimancito", lat: -23.720, lng: -64.600, provincia: "Jujuy", operador: "JEMSE", reservorio: "Yacoraite", profundidad: "3.800 - 4.300 m" }
    ];

    yacimientos.forEach(yac => {
      const marker = L.circleMarker([yac.lat, yac.lng], {
        color: '#000',
        fillColor: '#ffcc00',
        fillOpacity: 0.9,
        radius: 9
      }).addTo(map);

      marker.on('click', () => {
        document.getElementById('info-nombre').innerText = yac.nombre;
        document.getElementById('info-provincia').innerText = yac.provincia;
        document.getElementById('info-operador').innerText = yac.operador;
        document.getElementById('info-reservorio').innerText = yac.reservorio;
        document.getElementById('info-profundidad').innerText = yac.profundidad;
      });
    });
  }

  // 5. MODELO GEOLÓGICO 3D (THREE.JS)
  const container3D = document.getElementById('canvas-3d');
  if (container3D) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121824);

    const camera = new THREE.PerspectiveCamera(50, container3D.clientWidth / container3D.clientHeight, 0.1, 1000);
    camera.position.set(12, 10, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    container3D.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffcc00, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const layersGroup = new THREE.Group();
    const colors = [0x2a364f, 0xffcc00, 0x1f2937, 0x0284c7];

    for (let i = 0; i < 4; i++) {
      const geo = new THREE.CylinderGeometry(6 - i * 0.5, 7 - i * 0.5, 0.8, 32, 1, false, 0, Math.PI);
      const mat = new THREE.MeshStandardMaterial({ color: colors[i], wireframe: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = (i * 0.9) - 1.5;
      mesh.rotation.z = Math.PI;
      layersGroup.add(mesh);
    }
    scene.add(layersGroup);

    function animate() {
      requestAnimationFrame(animate);
      layersGroup.rotation.y += 0.003;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = container3D.clientWidth / container3D.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    });
  }

  // 6. GRÁFICO DE PRODUCCIÓN HISTÓRICA (CHART.JS)
  const ctx = document.getElementById('productionChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Gas Natural (MMm³/d)',
            data: [18.2, 16.5, 15.1, 14.2, 13.5, 13.0, 12.8],
            borderColor: '#ffcc00',
            backgroundColor: 'rgba(255, 204, 0, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Condensado (m³/d)',
            data: [2600, 2400, 2200, 2050, 1980, 1900, 1850],
            borderColor: '#38bdf8',
            backgroundColor: 'transparent',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#ffffff' } } },
        scales: {
          x: { ticks: { color: '#8c9ba5' }, grid: { color: '#202b3c' } },
          y: { ticks: { color: '#8c9ba5' }, grid: { color: '#202b3c' } }
        }
      }
    });
  }

  // 7. ANIMACIONES DE REVELADO
  gsap.utils.toArray(".history-card, .futuro-card, .simulador-card").forEach((card) => {
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

});