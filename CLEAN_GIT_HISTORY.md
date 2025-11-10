# 🧹 Limpiar Credenciales del Historial de Git

## ⚠️ IMPORTANTE: Las credenciales han sido expuestas

Si ya hiciste commits con las credenciales, necesitas:

1. **Cambiar las credenciales en MongoDB Atlas inmediatamente**
2. **Limpiar el historial de Git**
3. **Regenerar las credenciales**

---

## 🔐 Paso 1: Cambiar Credenciales en MongoDB Atlas

### Opción A: Cambiar la Contraseña del Usuario

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu proyecto
3. Ve a **Database Access**
4. Encuentra el usuario `luisaneuris60`
5. Haz clic en **Edit**
6. Haz clic en **Edit Password**
7. Genera una nueva contraseña segura
8. Guarda los cambios

### Opción B: Crear un Nuevo Usuario (Recomendado)

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu proyecto
3. Ve a **Database Access**
4. Haz clic en **Add New Database User**
5. Crea un nuevo usuario con una contraseña segura
6. Asigna los permisos necesarios
7. **Elimina el usuario antiguo** `luisaneuris60`

---

## 🧹 Paso 2: Limpiar el Historial de Git

### Opción A: Si NO has hecho push a GitHub/remoto

Si solo has hecho commits locales y NO has subido a GitHub:

```bash
# Ver los commits recientes
git log --oneline -10

# Hacer un soft reset al commit antes de agregar las credenciales
# Reemplaza <commit-hash> con el hash del commit seguro
git reset --soft <commit-hash>

# O si quieres eliminar los últimos N commits
git reset --soft HEAD~3  # Elimina los últimos 3 commits

# Revisar los cambios
git status

# Hacer un nuevo commit sin credenciales
git add .
git commit -m "Configure project for Vercel deployment (without credentials)"
```

### Opción B: Si YA hiciste push a GitHub/remoto

Si ya subiste los commits con credenciales a GitHub:

#### 1. Usar BFG Repo-Cleaner (Recomendado)

```bash
# Instalar BFG (macOS con Homebrew)
brew install bfg

# Hacer un backup del repositorio
cd ..
git clone --mirror "file:///Users/ltavarez/dev/Marketing Automation Software" backup-repo.git

# Crear un archivo con las credenciales a eliminar
cd "/Users/ltavarez/dev/Marketing Automation Software"
cat > credentials.txt << 'EOF'
luisaneuris60
zyUUHO5T1kSvbF4c
mongodb+srv://luisaneuris60:zyUUHO5T1kSvbF4c@cluster0.zllumyj.mongodb.net
EOF

# Limpiar el historial
bfg --replace-text credentials.txt

# Limpiar referencias
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Forzar el push (CUIDADO: esto reescribe el historial)
git push --force --all
```

#### 2. Usar git filter-branch (Alternativa)

```bash
# Hacer backup
git clone . ../backup-repo

# Filtrar el historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r . && \
   git reset \$GIT_COMMIT -- . ':!*.md' ':!api/index.ts' ':!.env*'" \
  --prune-empty --tag-name-filter cat -- --all

# Limpiar referencias
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Forzar el push
git push --force --all
```

### Opción C: Empezar de Cero (Más Seguro)

Si prefieres empezar con un repositorio limpio:

```bash
# Hacer backup de los archivos
cd ..
cp -r "Marketing Automation Software" "Marketing Automation Software-backup"

# Eliminar el repositorio Git actual
cd "Marketing Automation Software"
rm -rf .git

# Inicializar un nuevo repositorio
git init

# Agregar todos los archivos (ahora sin credenciales)
git add .

# Hacer el primer commit
git commit -m "Initial commit - Marketing Automation Software configured for Vercel"

# Si tenías un repositorio remoto, eliminarlo y crear uno nuevo
# O forzar el push (esto eliminará todo el historial remoto)
git remote add origin <tu-url-de-github>
git push -f origin main
```

---

## 🔒 Paso 3: Configurar Variables de Entorno Correctamente

### Crear archivo .env local (NO commitear)

```bash
# Crear archivo .env con tus credenciales NUEVAS
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://NUEVO_USUARIO:NUEVA_PASSWORD@cluster0.xxxxx.mongodb.net/marketing-automation?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tu-clave-jwt-super-segura
JWT_EXPIRE=30d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EOF

# Asegurarte de que .env esté en .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### Verificar que .gitignore esté correcto

```bash
# Ver si .env está ignorado
git check-ignore .env

# Debería mostrar: .env
# Si no muestra nada, agrégalo:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "Update .gitignore to exclude environment files"
```

---

## ✅ Paso 4: Verificar que las Credenciales NO estén en el Repositorio

```bash
# Buscar credenciales en el repositorio actual
git grep -i "luisaneuris60"
git grep -i "zyUUHO5T1kSvbF4c"

# Si encuentra algo, repite el paso 2

# Buscar en el historial completo
git log -p -S "luisaneuris60"
git log -p -S "zyUUHO5T1kSvbF4c"

# Si encuentra algo en el historial, usa BFG o filter-branch
```

---

## 📋 Checklist de Seguridad

- [ ] Credenciales cambiadas en MongoDB Atlas
- [ ] Usuario antiguo eliminado (opcional pero recomendado)
- [ ] Historial de Git limpiado
- [ ] Nuevas credenciales guardadas en `.env` local
- [ ] `.env` está en `.gitignore`
- [ ] Verificado que no hay credenciales en el repositorio
- [ ] Push forzado al remoto (si aplica)
- [ ] Variables de entorno configuradas en Vercel con las NUEVAS credenciales

---

## 🚨 Si Alguien Ya Clonó el Repositorio

Si otras personas ya clonaron el repositorio con las credenciales:

1. **Notifícales inmediatamente**
2. **Pídeles que eliminen sus clones locales**
3. **Después de limpiar el historial, pídeles que clonen de nuevo**

```bash
# Ellos deben hacer:
cd ..
rm -rf "Marketing Automation Software"
git clone <url-del-repo-limpio>
```

---

## 💡 Mejores Prácticas para el Futuro

### 1. Usar Variables de Entorno

```bash
# Siempre usa variables de entorno
const mongoURI = process.env.MONGODB_URI;

# NUNCA hagas esto:
const mongoURI = 'mongodb+srv://user:password@...';
```

### 2. Usar .env.example sin credenciales

```bash
# .env.example (SÍ commitear)
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/dbname

# .env (NO commitear)
MONGODB_URI=mongodb+srv://real-user:real-password@cluster0.xxxxx.mongodb.net/dbname
```

### 3. Configurar .gitignore desde el inicio

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Secrets
secrets/
*.key
*.pem
```

### 4. Usar git-secrets (Prevención)

```bash
# Instalar git-secrets
brew install git-secrets

# Configurar en el repositorio
cd "/Users/ltavarez/dev/Marketing Automation Software"
git secrets --install
git secrets --register-aws

# Agregar patrones personalizados
git secrets --add 'mongodb\+srv://[^:]+:[^@]+@'
git secrets --add 'password.*=.*[A-Za-z0-9]+'
```

---

## 📞 Recursos Adicionales

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Git Filter-Branch](https://git-scm.com/docs/git-filter-branch)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-secrets](https://github.com/awslabs/git-secrets)

---

## ⚠️ Resumen de Acciones URGENTES

```bash
# 1. Cambiar credenciales en MongoDB Atlas (AHORA)

# 2. Si NO has hecho push:
git reset --soft HEAD~5
git add .
git commit -m "Configure for Vercel (no credentials)"

# 3. Si YA hiciste push:
brew install bfg
echo "luisaneuris60" > credentials.txt
echo "zyUUHO5T1kSvbF4c" >> credentials.txt
bfg --replace-text credentials.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force --all

# 4. Crear .env local con NUEVAS credenciales
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://NUEVO_USER:NUEVA_PASS@cluster0.xxxxx.mongodb.net/marketing-automation
EOF

# 5. Verificar
git grep -i "luisaneuris60"  # No debería encontrar nada
```

---

¡Actúa rápido para proteger tus credenciales! 🔐
