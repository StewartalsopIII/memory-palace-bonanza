# Cómo Agregar Tu Párrafo

## Paso 1: Hacer Fork de Este Repo
Hacé clic en el botón "Fork" en la parte superior derecha de esta página.

## Paso 2: Clonar TU Fork
```bash
git clone [URL-DE-TU-FORK]
cd memory-palace-bonanza
```

## Paso 3: Crear Tu Rama
```bash
git checkout -b story-[tunombre]
```
Reemplazá [tunombre] con tu nombre real (sin espacios ni caracteres especiales)

## Paso 4: Leer La Historia Hasta Ahora
```bash
cat story/chapters/*.txt
```
O simplemente abrí la carpeta y lee los archivos en orden.

## Paso 5: Encontrar Tu Número de Párrafo
Mirá en `story/chapters/` y fijate cuál es el número más alto.
Si el último archivo es `02-juan.txt`, el tuyo será `03-tunombre.txt`

## Paso 6: Escribir Tu Párrafo
Creá un nuevo archivo: `story/chapters/[numero]-[tunombre].txt`

Ejemplo: `story/chapters/03-maria.txt`

Escribí 3-5 oraciones continuando la historia desde donde la dejó la última persona.

## Paso 7: Guardar y Verificar
```bash
cat story/chapters/03-maria.txt
```
¡Asegurate de que se vea bien!

## Paso 8: Hacer Commit de Tus Cambios
```bash
git add story/chapters/03-maria.txt
git commit -m "Agregar párrafo 3 por Maria"
```

## Paso 9: Push a TU Fork
```bash
git push origin story-[tunombre]
```

## Paso 10: Crear Pull Request
1. Andá a TU fork en GitHub
2. Vas a ver un banner amarillo que dice "Compare & pull request"
3. Hacé clic en él
4. Título: "Agregar párrafo [numero] por [tunombre]"
5. En la descripción, escribí: "Esto continúa la historia desde el párrafo [número anterior]"
6. Hacé clic en "Create pull request"

## Paso 11: Revisar El Párrafo de Alguien
1. Andá al repo ORIGINAL (StewartalsopIII/memory-palace-bonanza)
2. Hacé clic en "Pull requests"
3. Encontrá el PR de otra persona
4. Leé su párrafo
5. Dejá un comentario (algo lindo sobre su aporte a la historia)
6. Hacé clic en "Approve" si ves la opción

## Problemas Comunes

**"Fatal: not a git repository"**
→ No estás en la carpeta correcta. Ejecutá: `cd memory-palace-bonanza`

**"Permission denied"**
→ Estás tratando de hacer push a MI repo. Asegurate de haber clonado TU fork (debería tener TU nombre de usuario en la URL)

**"Branch already exists"**
→ Ya la creaste. Simplemente ejecutá: `git checkout story-[tunombre]`

**"Nothing to commit"**
→ ¿Guardaste tu archivo? Ejecutá: `ls story/chapters/` para verificar que esté ahí