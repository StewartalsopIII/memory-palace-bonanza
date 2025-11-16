## For Workshop Participants

### Step 1: Download Your Model
1. Go to Sketchfab.com
2. Find a FREE downloadable model (look for download button)
3. Download as glTF format (.glb file)
4. Rename it to: `memory-yourname.glb` (example: memory-joana.glb)

### Step 2: Add Your Model File
Put your `.glb` file here:
```
public/models/memory-objects/memory-yourname.glb
```

### Step 3: Create Your Registrar File
1. Copy `src/memory-objects/sampleMemory.ts`
2. Rename it to `src/memory-objects/memory-yourname.ts`
3. Edit these lines:
   - name: "Your Name's Memory"
   - modelPath: "/models/memory-objects/memory-yourname.glb"
   - position: [0, 0, 0] ← start here, adjust with AI help

### Step 4: Register Your Memory
Open `src/memory-objects/index.ts` and add your import:
```typescript
import { yourMemory } from './memory-yourname';
```
Then add `yourMemory` to the registrars array.

### Step 5: Test It
```bash
npm run dev
```
Your model should appear! Use the debug panel to verify.

### Step 6: Commit & Push
```bash
git add public/models/memory-objects/memory-yourname.glb
git add src/memory-objects/memory-yourname.ts
git add src/memory-objects/index.ts
git commit -m "Add [your name]'s memory"
git push origin memory-yourname
```