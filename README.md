#  Mi Salud Mexa

App PWA de control de calorías y macros con enfoque en comida mexicana. Inspirada en Fitia, pero con tacos, chilaquiles y ramen coreano. 

![PWA](https://img.shields.io/badge/PWA-Installable-7000ff?style=for-the-badge&logo=progressive-web-apps&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-00e676?style=for-the-badge)

---

##  ¿Qué es?

**Mi Salud Mexa** es una aplicación web progresiva (PWA) que te permite:

-  **Registrar calorías y macros** (proteína, carbos, grasas) de forma diaria.
-  **Buscar alimentos mexicanos** precargados (chilaquiles, tacos, pozole, ramen, etc.).
-  **Agregar alimentos personalizados** con sus valores nutricionales.
-  **Trackear consumo de agua** con botones rápidos (+250ml / +500ml).
-  **Ver calorías restantes, consumidas y quemadas** en tiempo real.
-  **Reset automático diario** del progreso y guardado en historial.
-  **Funciona offline** gracias al Service Worker.
-  **Diseño oscuro neón** estilo Fitia, optimizado para móvil.

---

## Demo

> Próximamente disponible en GitHub Pages:  
> `https://<tu-usuario>.github.io/mi-salud-mexa/`

---

##  Tecnologías usadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Diseño neón, glassmorphism, animaciones |
| **JavaScript Vanilla** | Lógica de la app (sin frameworks) |
| **LocalStorage** | Persistencia de datos |
| **Service Worker** | Cacheo y modo offline |
| **Web App Manifest** | Instalación como PWA |

---

##  Estructura del proyecto
mi-salud-mexa/
├── index.html # Estructura principal de la app
├── styles.css # Estilos con tema neón dark
├── app.js # Lógica de la aplicación
├── foods.json # Base de datos de 50 alimentos mexicanos
├── manifest.json # Configuración PWA
├── sw.js # Service Worker (offline)
├── icon-192.png # Ícono PWA 192x192
├── icon-512.png # Ícono PWA 512x512
└── README.md


---

##  Instalación local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/sebastiansanz1/mi-salud-mexa.git
   cd mi-salud-mexa