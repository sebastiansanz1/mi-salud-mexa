// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.error);
}

// --- ESTADO GLOBAL ---
let mexaFoods = [];
let appData = {
  targetCal: 2000,
  targetProtein: 150,
  targetCarbs: 200,
  targetFats: 65,
  waterConsumed: 0,
  consumedCal: 0,
  burnedCal: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  loggedFoods: [],
  exercises: [],
  lastDate: ''
};

// --- MANEJO DE FECHAS (ZONA HORARIA LOCAL) ---
function getTodayString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// --- CARGA DE DATOS Y RESET DIARIO ---
function loadData() {
  const saved = localStorage.getItem('myHealthApp_data');
  const today = getTodayString();

  if (saved) {
    appData = JSON.parse(saved);

    // Reinicio diario si cambia de fecha
    if (appData.lastDate !== today) {
      saveToHistory(appData);

      appData.lastDate = today;
      appData.consumedCal = 0;
      appData.burnedCal = 0;
      appData.waterConsumed = 0;
      appData.protein = 0;
      appData.carbs = 0;
      appData.fats = 0;
      appData.loggedFoods = [];
      appData.exercises = [];

      localStorage.setItem('myHealthApp_data', JSON.stringify(appData));
    }
  } else {
    appData.lastDate = today;
    localStorage.setItem('myHealthApp_data', JSON.stringify(appData));
  }

  updateUI();
}

function saveData() {
  localStorage.setItem('myHealthApp_data', JSON.stringify(appData));
  updateUI();
}

function saveToHistory(pastData) {
  if (!pastData.lastDate) return;
  
  const history = JSON.parse(localStorage.getItem('myHealthApp_history') || '[]');
  history.unshift({
    fecha: pastData.lastDate,
    calorias: pastData.consumedCal,
    proteina: pastData.protein,
    agua: pastData.waterConsumed
  });

  localStorage.setItem('myHealthApp_history', JSON.stringify(history));
}

// --- CARGA DE ALIMENTOS (JSON + PERSONALIZADOS) ---
async function loadMexaFoods() {
  try {
    const res = await fetch('./foods.json');
    const defaultFoods = await res.json();
    
    // Recuperar comidas personalizadas del localStorage
    const customSaved = JSON.parse(localStorage.getItem('myCustomFoods') || '[]');
    
    // Unir ambas listas
    mexaFoods = [...customSaved, ...defaultFoods];
    renderSearchResults(mexaFoods);
  } catch (err) {
    console.error("Error al cargar la comida mexa:", err);
  }
}

// --- ACTUALIZACIÓN DE INTERFAZ (UI) ---
function updateUI() {
  const remaining = appData.targetCal - appData.consumedCal + appData.burnedCal;
  document.getElementById('consumed-cal').textContent = appData.consumedCal;
  document.getElementById('burned-cal').textContent = appData.burnedCal;
  document.getElementById('remaining-cal').textContent = Math.max(0, Math.round(remaining));

  const progressPercent = Math.min(100, (appData.consumedCal / appData.targetCal) * 100);
  document.getElementById('cal-progress').style.width = `${progressPercent}%`;

  document.getElementById('protein-count').textContent = `${Math.round(appData.protein)} / ${appData.targetProtein}g`;
  document.getElementById('carbs-count').textContent = `${Math.round(appData.carbs)} / ${appData.targetCarbs}g`;
  document.getElementById('fats-count').textContent = `${Math.round(appData.fats)} / ${appData.targetFats}g`;

  const waterLiters = (appData.waterConsumed / 1000).toFixed(1);
  document.getElementById('water-count').textContent = `${waterLiters} / 2.5 L`;

  renderLoggedFoods();
}

function renderLoggedFoods() {
  const list = document.getElementById('food-list');
  if (!appData.loggedFoods || appData.loggedFoods.length === 0) {
    list.innerHTML = '<li class="empty-state">No has registrado alimentos hoy.</li>';
    return;
  }

  list.innerHTML = appData.loggedFoods.map(item => `
    <li class="food-item-row">
      <div>
        <span class="food-item-title">${item.nombre}</span>
        <span class="food-item-sub">P: ${item.proteinas}g | C: ${item.carbs}g | G: ${item.grasas}g</span>
      </div>
      <span class="food-item-cal">+${item.calorias} kcal</span>
    </li>
  `).join('');
}

function renderSearchResults(items) {
  const container = document.getElementById('search-results');
  container.innerHTML = items.map(food => `
    <div class="search-card" onclick="addFoodToLog(${food.id})">
      <div>
        <strong>${food.nombre}</strong>
        <span style="display:block; font-size: 11px; color: #8e8e93;">${food.categoria} • ${food.proteinas}g Prot</span>
      </div>
      <span style="color: #00e676; font-weight:700;">${food.calorias} kcal</span>
    </div>
  `).join('');
}

// --- ACCIONES ---
function addFoodToLog(foodId) {
  const food = mexaFoods.find(f => f.id === foodId);
  if (!food) return;

  appData.consumedCal += food.calorias;
  appData.protein += food.proteinas;
  appData.carbs += food.carbs;
  appData.fats += food.grasas;
  appData.loggedFoods.unshift(food);

  saveData();
  closeModal();
}

function addCustomFood(nombre, calorias, proteinas, carbs, grasas) {
  const newFood = {
    id: Date.now(),
    nombre: nombre,
    calorias: Number(calorias),
    proteinas: Number(proteinas),
    carbs: Number(carbs),
    grasas: Number(grasas),
    categoria: "Personalizado"
  };

  mexaFoods.unshift(newFood);
  
  const customSaved = JSON.parse(localStorage.getItem('myCustomFoods') || '[]');
  customSaved.unshift(newFood);
  localStorage.setItem('myCustomFoods', JSON.stringify(customSaved));

  renderSearchResults(mexaFoods);
}

function addWater(amount) {
  appData.waterConsumed += amount;
  saveData();
}

function resetWater() {
  appData.waterConsumed = 0;
  saveData();
}

// --- MODAL Y BUSCADOR ---
const modal = document.getElementById('food-modal');
document.getElementById('btn-open-modal').onclick = () => modal.classList.add('active');
document.getElementById('btn-close-modal').onclick = closeModal;

function closeModal() {
  modal.classList.remove('active');
}

document.getElementById('food-search').oninput = (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = mexaFoods.filter(f => 
    f.nombre.toLowerCase().includes(query) || 
    f.categoria.toLowerCase().includes(query)
  );
  renderSearchResults(filtered);
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  loadMexaFoods();
});

// --- FUNCIÓN FALTANTE: GUARDAR COMIDA PERSONALIZADA ---
function submitCustomFood() {
  const name = document.getElementById('custom-name').value.trim();
  const cal = document.getElementById('custom-cal').value;
  const prot = document.getElementById('custom-prot').value;
  const carbs = document.getElementById('custom-carbs').value;
  const fats = document.getElementById('custom-fats').value;

  if (!name || !cal) {
    alert("Por lo menos ponle nombre y calorías, bro.");
    return;
  }

  // Llama a tu función existente para registrarla
  addCustomFood(name, cal, prot || 0, carbs || 0, fats || 0);

  // Limpiar inputs del acordeón
  document.getElementById('custom-name').value = '';
  document.getElementById('custom-cal').value = '';
  document.getElementById('custom-prot').value = '';
  document.getElementById('custom-carbs').value = '';
  document.getElementById('custom-fats').value = '';

  // Opcional: Seleccionar automáticamente la recién creada o cerrar acordeón
  alert("¡Comida mexa guardada con éxito! 🌮");
}