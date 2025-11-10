#!/bin/bash

echo "🚀 Configurando sistema de login..."
echo ""

# Verificar si existe .env en el servidor
if [ ! -f "server/.env" ]; then
    echo "📝 Creando archivo .env..."
    cp server/.env.example server/.env
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

echo ""
echo "📦 Instalando dependencias del servidor..."
cd server
npm install

echo ""
echo "✅ Configuración completada!"
echo ""
echo "ℹ️  El usuario administrador se creará automáticamente"
echo "   cuando inicies el servidor por primera vez."
echo ""
echo "Para iniciar el sistema:"
echo "1. En una terminal: cd server && npm run dev"
echo "2. En otra terminal: npm run dev"
echo ""
echo "Credenciales de acceso:"
echo "Email: admin@unicaribe.edu.do"
echo "Password: 123456"
