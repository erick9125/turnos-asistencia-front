# Sistema de Turnos y Asistencia - Frontend

Frontend desarrollado en React + TypeScript para el sistema de gestión de turnos y asistencias que se conecta con una API Laravel 10+.

## 🚀 Características

- **React 18** con TypeScript
- **Vite** como bundler
- **React Router DOM** para navegación
- **React Query** (@tanstack/react-query) para manejo de datos asíncronos
- **Axios** para peticiones HTTP
- **Tailwind CSS v4** para estilos
- **Autenticación** con Laravel Sanctum (Bearer Token)
- **Roles y permisos**: Admin, Manager, Worker

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** o **pnpm**
- **Git**

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/erick9125/turnos-asistencia-front.git
   cd turnos-asistencia-front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
   
   > **Nota**: Ajusta la URL según la configuración de tu backend Laravel.

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Clientes HTTP y funciones de API
│   ├── httpClient.ts      # Configuración de Axios con interceptores
│   ├── authApi.ts         # Endpoints de autenticación
│   ├── usersApi.ts        # Endpoints de usuarios
│   ├── shiftsApi.ts       # Endpoints de turnos
│   ├── workersApi.ts      # Endpoints de trabajadores
│   ├── devicesApi.ts      # Endpoints de dispositivos
│   ├── marksApi.ts        # Endpoints de marcas
│   ├── reportsApi.ts     # Endpoints de reportes
│   └── exportApi.ts      # Endpoints de exportación
├── components/
│   └── common/           # Componentes reutilizables
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Table.tsx
│       ├── Pagination.tsx
│       └── Alert.tsx
├── context/
│   └── AuthContext.tsx   # Contexto de autenticación
├── lib/
│   └── reactQuery.ts      # Configuración de React Query
├── modules/
│   ├── auth/             # Módulo de autenticación
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   ├── admin/            # Módulo de administración
│   │   └── pages/
│   ├── manager/          # Módulo de gestión
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   ├── worker/           # Módulo de trabajador
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   └── dashboard/        # Layout y componentes del dashboard
│       ├── layout/
│       └── components/
├── router/
│   ├── AppRouter.tsx     # Configuración de rutas
│   └── ProtectedRoute.tsx # Componente de rutas protegidas
├── types/
│   └── index.ts          # Definiciones de tipos TypeScript
├── styles/
│   └── index.css         # Estilos globales y Tailwind
├── App.tsx
└── main.tsx
```

## 🔐 Autenticación

El sistema utiliza **Laravel Sanctum** con autenticación por Bearer Token:

1. El usuario inicia sesión en `/login`
2. Se guarda el token en `localStorage`
3. El token se añade automáticamente a todas las peticiones mediante interceptores de Axios
4. Si el token expira (401), se redirige automáticamente a `/login`

## 👥 Roles y Permisos

### Admin
- Gestión completa de usuarios (CRUD)
- Acceso: `/admin/users`

### Manager
- Gestión de turnos (CRUD)
- Gestión de dispositivos
- Visualización de reportes (Asistencia, Atrasos, Horas Extra)
- Accesos:
  - `/manager/shifts`
  - `/manager/devices`
  - `/manager/reports`

### Worker
- Visualización de turnos semanales
- Marcaje remoto (entrada/salida)
- Accesos:
  - `/worker/shifts`

## 🔌 Configuración de la API

El frontend está configurado para consumir una API Laravel con la siguiente estructura:

### Base URL
- Por defecto: `http://localhost:8000/api/v1`
- Configurable mediante variable de entorno `VITE_API_BASE_URL`

### Formato de Respuestas
La API debe retornar respuestas en el siguiente formato:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... },
  "pagination": { ... } // Opcional, cuando aplica
}
```

### Endpoints Principales

- `POST /auth/login` - Iniciar sesión
- `GET /users` - Listar usuarios (Admin)
- `POST /users` - Crear usuario (Admin)
- `PATCH /users/{id}` - Actualizar usuario (Admin)
- `DELETE /users/{id}` - Eliminar usuario (Admin)
- `GET /shifts` - Listar turnos (Manager)
- `POST /shifts` - Crear turno (Manager)
- `PUT /shifts/{id}` - Actualizar turno (Manager)
- `DELETE /shifts/{id}` - Eliminar turno (Manager)
- `GET /workers/{id}/shifts/week` - Turnos semanales del trabajador
- `POST /marks/remote` - Crear marca remota
- `GET /devices` - Listar dispositivos
- `POST /devices` - Crear dispositivo
- `PATCH /devices/{id}/disable` - Desactivar dispositivo
- `GET /reports/attendance` - Reporte de asistencia
- `GET /reports/delays` - Reporte de atrasos
- `GET /reports/overtime` - Reporte de horas extra

## 🎨 Estilos

El proyecto utiliza **Tailwind CSS v4** con estilos inline para componentes críticos. Los estilos se importan en `src/index.css`:

```css
@import "tailwindcss";
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🚢 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🔧 Configuración Adicional

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL base de la API Laravel
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### CORS

Asegúrate de que tu backend Laravel tenga configurado CORS para permitir peticiones desde el frontend:

```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS
Verifica que el backend Laravel tenga configurado CORS correctamente y que la URL en `.env` sea la correcta.

### Error 401 (Unauthorized)
- Verifica que el token se esté guardando correctamente en `localStorage`
- Asegúrate de que el backend esté retornando el token en el formato correcto
- Verifica que el token no haya expirado

## 📝 Notas de Desarrollo

- **Seguridad desactivada temporalmente**: El componente `ProtectedRoute` está configurado para permitir acceso sin autenticación durante el desarrollo. Para reactivar la seguridad, descomenta el código en `src/router/ProtectedRoute.tsx`.
- **Estilos inline**: Algunos componentes utilizan estilos inline en lugar de clases de Tailwind para garantizar compatibilidad.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Erick Morales**

- GitHub: [@erick9125](https://github.com/erick9125)

## 🔗 Enlaces

- Repositorio: [https://github.com/erick9125/turnos-asistencia-front](https://github.com/erick9125/turnos-asistencia-front)
- Backend API: Laravel 10+ (repositorio separado)

---

**Nota**: Este proyecto requiere que el backend Laravel esté corriendo y configurado correctamente para funcionar completamente.
