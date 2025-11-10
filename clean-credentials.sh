#!/bin/bash

# Script para limpiar credenciales del historial de Git
# ADVERTENCIA: Este script reescribe el historial de Git

set -e

echo "🧹 Limpieza de Credenciales del Historial de Git"
echo "=================================================="
echo ""
echo "⚠️  ADVERTENCIA: Este script reescribirá el historial de Git"
echo "⚠️  Asegúrate de haber hecho un backup antes de continuar"
echo ""
read -p "¿Deseas continuar? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Verificar si hay cambios sin commitear
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Hay cambios sin commitear. Por favor, commitea o descarta los cambios primero."
    git status -s
    exit 1
fi

# Crear backup
echo "📦 Creando backup del repositorio..."
BACKUP_DIR="../marketing-automation-backup-$(date +%Y%m%d-%H%M%S)"
git clone . "$BACKUP_DIR"
echo "✅ Backup creado en: $BACKUP_DIR"
echo ""

# Verificar si las credenciales están en el repositorio actual
echo "🔍 Buscando credenciales en el repositorio actual..."
if git grep -q "luisaneuris60" 2>/dev/null || git grep -q "zyUUHO5T1kSvbF4c" 2>/dev/null; then
    echo "❌ ¡Aún hay credenciales en los archivos actuales!"
    echo "Por favor, elimínalas manualmente primero."
    exit 1
fi
echo "✅ No se encontraron credenciales en los archivos actuales"
echo ""

# Buscar en el historial
echo "🔍 Buscando credenciales en el historial de Git..."
if git log --all -p -S "luisaneuris60" --oneline | head -n 1 | grep -q .; then
    echo "⚠️  Se encontraron credenciales en el historial"
    echo ""
    
    # Opción 1: Reset suave (si no se ha hecho push)
    echo "Opciones de limpieza:"
    echo "1) Reset suave (solo si NO has hecho push a remoto)"
    echo "2) BFG Repo-Cleaner (recomendado si ya hiciste push)"
    echo "3) Cancelar"
    echo ""
    read -p "Selecciona una opción (1-3): " -n 1 -r option
    echo ""
    
    case $option in
        1)
            echo "📝 ¿Cuántos commits quieres eliminar?"
            read -p "Número de commits: " num_commits
            
            echo "🔄 Haciendo reset suave de los últimos $num_commits commits..."
            git reset --soft HEAD~$num_commits
            
            echo "✅ Reset completado. Ahora haz un nuevo commit:"
            echo "   git add ."
            echo "   git commit -m 'Configure for Vercel deployment (no credentials)'"
            ;;
        2)
            # Verificar si BFG está instalado
            if ! command -v bfg &> /dev/null; then
                echo "❌ BFG no está instalado"
                echo "Instálalo con: brew install bfg"
                exit 1
            fi
            
            # Crear archivo de credenciales
            echo "📝 Creando archivo de credenciales a eliminar..."
            cat > /tmp/credentials.txt << 'EOF'
luisaneuris60
zyUUHO5T1kSvbF4c
mongodb+srv://luisaneuris60:zyUUHO5T1kSvbF4c@cluster0.zllumyj.mongodb.net
EOF
            
            echo "🧹 Ejecutando BFG Repo-Cleaner..."
            bfg --replace-text /tmp/credentials.txt
            
            echo "🗑️  Limpiando referencias..."
            git reflog expire --expire=now --all
            git gc --prune=now --aggressive
            
            echo "✅ Limpieza completada"
            echo ""
            echo "⚠️  IMPORTANTE: Ahora debes hacer push forzado:"
            echo "   git push --force --all"
            echo ""
            echo "⚠️  Y notificar a todos los colaboradores que clonen de nuevo"
            
            rm /tmp/credentials.txt
            ;;
        3)
            echo "❌ Operación cancelada"
            exit 0
            ;;
        *)
            echo "❌ Opción inválida"
            exit 1
            ;;
    esac
else
    echo "✅ No se encontraron credenciales en el historial"
fi

echo ""
echo "✨ Proceso completado"
echo ""
echo "📋 Próximos pasos:"
echo "1. Cambia las credenciales en MongoDB Atlas"
echo "2. Crea un archivo .env local con las NUEVAS credenciales"
echo "3. Verifica que .env esté en .gitignore"
echo "4. Si hiciste push, ejecuta: git push --force --all"
echo ""
echo "📖 Lee CLEAN_GIT_HISTORY.md para más detalles"
