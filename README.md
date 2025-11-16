<div align="center">

# 🏛️ Palacio de la Memoria · Bonanza

Workshop colaborativo para añadir tu propio objeto 3D dentro de un Parthenon compartido. Practicamos Git, GitHub y coding asistido por IA mientras construimos algo bello juntos.

</div>

---

## 🎯 Objetivo del Taller
- ✅ Colaboración en Git: ramas, commits y PRs
- ✅ Uso de IA (Claude, Cursor, etc.) para generar y ajustar código
- ✅ Trabajo con glTF/glb y escenas en three.js
- ✅ Flujo profesional de trabajo en equipo

> Al final tendrás tu “memoria” permanente dentro del proyecto común.

---

## 📋 Antes del Taller

### 1. Instala herramientas
- Node.js ≥ 18 → <https://nodejs.org>
- Git → <https://git-scm.com>
- VS Code (recomendado) → <https://code.visualstudio.com>

### 2. Prepara el repo

```bash
git clone https://github.com/StewartalsopIII/memory-palace-bonanza.git
cd memory-palace-bonanza
npm install
npm run dev
```

Abre <http://localhost:3000> y confirma:

- Parthenon visible
- Cubo rojo de prueba
- Panel debug (WebGL ✓, Renderer ✓, FPS)

Si algo falla, revisa `TROUBLESHOOTING.md` o avisa antes del workshop.

---

## 🚀 Durante el Taller

### Fase 1 · Encuentra tu modelo (15-20 min)
1. Ve a [Sketchfab](https://sketchfab.com).
2. Filtra por “Downloadable” + “Free”.
3. Busca “low poly” para modelos ligeros.
4. En “Model Information” revisa:
   - Tamaño < **10 MB**
   - Triángulos < **500 k** (ideal < 100 k)
5. Al descargar:
   - Botón **Download**
   - Elegir **glTF Binary (.glb)**  
   - Renombra a `memory-tu-nombre.glb` (ej. `memory-stewart.glb`)

### Fase 2 · Crea tu rama (5 min)

⚠️ Nunca trabajes directo en `main`.

```bash
git checkout main
git pull origin main
git checkout -b memory-tu-nombre
```

> Cada branch es tu sandbox personal; nadie pisa el trabajo de los demás.

### Fase 3 · Agrega tu modelo (10 min)

1. Copia tu `.glb` a:
   ```
   public/models/memory-objects/memory-tu-nombre.glb
   ```
2. Duplica el registrador:
   ```bash
   cp src/memory-objects/sampleMemory.ts \
      src/memory-objects/memory-tu-nombre.ts
   ```
3. Edita `src/memory-objects/memory-tu-nombre.ts`:
   ```ts
   export const tuNombreMemory = {
     name: "Objeto de [Tu Nombre]",
     modelPath: "/models/memory-objects/memory-tu-nombre.glb",
     position: [0, 0, 0],
     rotation: [0, 0, 0],
     scale: [1, 1, 1],
   };
   ```
4. Registra en `src/memory-objects/index.ts`:
   ```ts
   import { tuNombreMemory } from "./memory-tu-nombre";

   export const registrars = [
     sampleMemory,
     tuNombreMemory,
   ];
   ```

### Fase 4 · Ajusta posición con IA (15 min)

1. Inicia dev server:
   ```bash
   npm run dev
   ```
2. Abre <http://localhost:3000>.
3. Si no ves tu modelo, usa prompts como:
   ```
   "Mi modelo está bajo el piso, muévelo hacia arriba"
   "Rota mi modelo 90° para que mire al oeste"
   "Mi modelo es gigante, bájale la escala a 0.2"
   ```
4. Itera rápido en la consola:
   ```js
   window.DEBUG.addMemoryObject({
     name: "Test",
     modelPath: "/models/memory-objects/memory-tu-nombre.glb",
     position: [5, 0, 5],
     scale: [2, 2, 2],
   });
   ```
   Luego copia los valores finales a tu archivo `.ts`.

### Fase 5 · Guarda tu trabajo (5 min)

```bash
git status
git add public/models/memory-objects/memory-tu-nombre.glb
git add src/memory-objects/memory-tu-nombre.ts
git add src/memory-objects/index.ts
git commit -m "Agregar memoria de [Tu Nombre]"
git push origin memory-tu-nombre
```

### Fase 6 · Pull Request (5 min)
1. Ve al repo en GitHub.
2. Haz clic en **Compare & pull request**.
3. Usa este template:
   ```markdown
   ## Lo que agregué
   - Nombre: [Tu Nombre]
   - Modelo: [Descripción]
   - Archivo: memory-tu-nombre.glb

   ## Checklist
   - [x] Tamaño < 10 MB
   - [x] Registrador creado
   - [x] index.ts actualizado
   - [x] Probado localmente
   ```
4. Clic en **Create pull request**.

### Fase 7 · Galería final (10 min)

```bash
git checkout main
git pull origin main
npm run dev
```

Disfruta el Parthenon lleno de memorias 🥳.

---

## 🛠️ Comandos útiles
```bash
git branch   # ver en qué rama estás
git status   # archivos modificados
```
```js
window.DEBUG.scene.children // inspecciona la escena
window.DEBUG.addTestCube()  // cubo temporal
```
```bash
npm run dev   # servidor local
```

---

## ⚠️ Problemas comunes
- **Modelo invisible** → revisa `modelPath`, DevTools y formato `.glb`.
- **Modelo gigante/invisible** → ajusta `scale` (ej. `[0.1,0.1,0.1]`) y `position` (-20 a 20).
- **Errores Git** → confirma que estás en tu rama (`git branch`).
- **No puedo hacer push** → ¿hiciste `commit`?, ¿creaste tu branch?

---

## 📚 Recursos
- Sketchfab → <https://sketchfab.com>
- Git Cheat Sheet → <https://education.github.com/git-cheat-sheet-education.pdf>
- Three.js Docs → <https://threejs.org/docs/>

---

## 🎓 Conceptos clave
- **Rama Git**: copia personal para experimentar sin romper main.
- **Commit**: punto de guardado con mensaje descriptivo.
- **Pull Request**: pedir que integren tus cambios al repo central.
- **Cero conflictos**: cada quien crea archivos con nombres únicos.

---

## 👨‍🏫 Filosofía del taller
“Vibe coding”: aprender creando algo visualmente hermoso y significativo. La IA es tu copiloto y Git el pegamento entre personas. No buscamos perfección, sino proceso y colaboración.

---

## 📞 Soporte
- Lee `TROUBLESHOOTING.md`
- Pregunta en el Zoom
- Comparte pantalla si necesitas ayuda

¡Nos vemos en el taller! 🏛️✨