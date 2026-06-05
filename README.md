# Quiniela Mundial 2026 🏆⚽

Aplicación web full-stack para gestionar una quiniela del Mundial FIFA 2026. Permite a los participantes registrarse, predecir los 72 partidos de la fase de grupos, reportar su pago y seguir el ranking en tiempo real.

**Stack:** Next.js 16 · Prisma 7 · PostgreSQL (Supabase) · Tailwind CSS · Vercel

---

## Tabla de contenido

1. [Desarrollo local](#desarrollo-local)
2. [Despliegue en producción](#despliegue-en-producción)
   - [Paso 1 — Subir el código a GitHub](#paso-1--subir-el-código-a-github)
   - [Paso 2 — Crear proyecto en Supabase](#paso-2--crear-proyecto-en-supabase)
   - [Paso 3 — Crear proyecto en Vercel](#paso-3--crear-proyecto-en-vercel)
   - [Paso 4 — Variables de entorno en Vercel](#paso-4--variables-de-entorno-en-vercel)
   - [Paso 5 — Ejecutar migraciones y seeds](#paso-5--ejecutar-migraciones-y-seeds)
   - [Paso 6 — Validar la URL pública](#paso-6--validar-la-url-pública)
3. [Dominio personalizado](#dominio-personalizado)
4. [Bucket de comprobantes (Supabase Storage)](#bucket-de-comprobantes-supabase-storage)
5. [Variables de entorno — referencia completa](#variables-de-entorno--referencia-completa)
6. [Scripts disponibles](#scripts-disponibles)
7. [Checklist antes de publicar](#checklist-antes-de-publicar)
8. [Seguridad](#seguridad)

---

## Desarrollo local

### Requisitos

- Node.js 18+
- PostgreSQL (usa Supabase gratis o instala PostgreSQL localmente)
- npm

### Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/mundial2026.git
cd mundial2026

# 2. Instalar dependencias (también ejecuta `prisma generate` automáticamente)
npm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Editar .env con tus credenciales de Supabase
nano .env

# 5. Aplicar el esquema a la base de datos
npx prisma migrate deploy

# 6. Cargar datos iniciales (equipos, partidos, configuración)
npm run db:seed

# 7. Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en **http://localhost:3000**

---

## Despliegue en producción

### Paso 1 — Subir el código a GitHub

```bash
git init
git add .
git commit -m "Initial commit"

# Crear repositorio en github.com, luego:
git remote add origin https://github.com/tu-usuario/mundial2026.git
git push -u origin main
```

> **Importante:** `.env` ya está en `.gitignore`. Nunca subas credenciales reales al repositorio.

---

### Paso 2 — Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita.
2. Crea un nuevo proyecto → elige región `us-east-1` o la más cercana.
3. Anota la contraseña de la base de datos. **No la podrás ver de nuevo.**

#### Obtener las URLs de base de datos

Ve a **Project Settings → Database → Connection string**:

| Uso | Modo | Puerto | Variable |
|-----|------|--------|----------|
| App en producción (Prisma cliente) | Transaction / PgBouncer | `6543` | `DATABASE_URL` |
| Migraciones (Prisma CLI) | Session / Direct | `5432` | `DIRECT_URL` |

Para `DATABASE_URL` (con parámetros de pooling):
```
postgresql://postgres.XXXX:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Para `DIRECT_URL` (conexión directa para migraciones):
```
postgresql://postgres.XXXX:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

#### Obtener las claves de API

Ve a **Project Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL` → Project URL (`https://xxxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon / public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (**secreto, solo en el backend**)

---

### Paso 3 — Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New → Project**
2. Conecta tu cuenta de GitHub y selecciona el repositorio `mundial2026`
3. Vercel detecta Next.js automáticamente
4. **No hagas Deploy todavía** — primero configura las variables de entorno

---

### Paso 4 — Variables de entorno en Vercel

En **Settings → Environment Variables**, agrega cada una de estas variables para el entorno **Production**:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL Supabase con puerto 6543 (pgbouncer) |
| `DIRECT_URL` | URL Supabase con puerto 5432 (direct, para CLI) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secreto) |
| `NEXT_PUBLIC_APP_URL` | `https://tu-proyecto.vercel.app` |
| `NEXTAUTH_SECRET` | String aleatorio (ver más abajo) |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
| `ADMIN_EMAIL` | Email del administrador |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt de la contraseña (ver más abajo) |

#### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
# Ejemplo: K7dRpM4xZ2vQnLsYtBjHwCuAoGeNfI+1XmPkVhFaE8c=
```

#### Generar ADMIN_PASSWORD_HASH

```bash
node -e "require('bcryptjs').hash('tu-contraseña-segura', 10).then(console.log)"
# Resultado: $2a$10$abc123...
```

Si `bcryptjs` no está instalado:
```bash
npm install -g bcryptjs
```

Haz clic en **Deploy** una vez configuradas las variables.

---

### Paso 5 — Ejecutar migraciones y seeds

Con las credenciales de Supabase en tu `.env` local:

```bash
# Aplicar el esquema de base de datos a Supabase
npx prisma migrate deploy

# Cargar equipos, partidos y configuración inicial
npm run db:seed
```

Si aún no tienes migraciones generadas:
```bash
# Crear el migration inicial desde el schema actual
npx prisma migrate dev --name init

# Luego aplicar en producción:
npx prisma migrate deploy
```

> Las migraciones requieren conexión directa. Asegúrate de que `DIRECT_URL` esté configurado en `.env`.

---

### Paso 6 — Validar la URL pública

1. Visita `https://tu-proyecto.vercel.app`
2. Prueba el registro de un participante
3. Verifica que el ranking y los resultados cargan
4. Accede al admin en `/admin` con tus credenciales
5. Revisa **Vercel → Functions → Logs** si hay errores

---

## Dominio personalizado

### 1. Comprar el dominio

Servicios recomendados:
- [Namecheap](https://namecheap.com) — económico, interfaz sencilla
- [Cloudflare Registrar](https://cloudflare.com) — precio de costo, excelente rendimiento de DNS

### 2. Conectar en Vercel

1. **Vercel → Settings → Domains → Add Domain**
2. Escribe tu dominio (ej: `quinielamundial2026.com`)
3. Vercel te mostrará los registros DNS a configurar:

| Tipo | Nombre | Valor |
|------|--------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

### 3. Configurar DNS

En el panel de tu registrador, agrega los registros indicados. La propagación tarda entre 5 minutos y 48 horas (generalmente menos de 1 hora).

### 4. SSL automático

Vercel genera el certificado SSL automáticamente (Let's Encrypt). No requiere configuración adicional.

### 5. Actualizar variables de entorno

Una vez activo el dominio, actualiza en Vercel:
- `NEXT_PUBLIC_APP_URL` → `https://tu-dominio.com`
- `NEXTAUTH_URL` → `https://tu-dominio.com`

Luego redespliega: **Deployments → Redeploy**.

---

## Bucket de comprobantes (Supabase Storage)

Para almacenar imágenes de comprobantes de pago de forma segura:

### Crear el bucket

1. Supabase → **Storage → New bucket**
2. Nombre: `comprobantes`
3. **Desactiva "Public bucket"** — los comprobantes son privados
4. Haz clic en **Create bucket**

### Política de acceso (RLS)

En **Storage → Policies → comprobantes**, crea:

```sql
-- Solo el service role (admin) puede leer y escribir
CREATE POLICY "Admin only" ON storage.objects
  FOR ALL USING (auth.role() = 'service_role');
```

---

## Variables de entorno — referencia completa

| Variable | Req. | Descripción |
|----------|------|-------------|
| `DATABASE_URL` | ✅ | URL PostgreSQL via pgbouncer (puerto 6543) |
| `DIRECT_URL` | ✅ | URL PostgreSQL directa (puerto 5432, solo CLI) |
| `NEXT_PUBLIC_SUPABASE_URL` | ⬜ | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⬜ | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ⬜ | Clave de servicio (solo backend) |
| `NEXT_PUBLIC_APP_URL` | ✅ | URL pública sin slash final |
| `NEXTAUTH_SECRET` | ✅ | Secreto de sesiones (min 32 chars aleatorios) |
| `NEXTAUTH_URL` | ✅ | URL base igual a `APP_URL` |
| `ADMIN_EMAIL` | ✅ | Email del administrador |
| `ADMIN_PASSWORD_HASH` | ✅ | Hash bcrypt de la contraseña admin |
| `ENTRY_PRICE_USD` | ⬜ | Precio en USD (default: 20) |
| `PAYMENT_BANK` | ⬜ | Banco pago móvil (default: Banesco) |
| `PAYMENT_PHONE` | ⬜ | Teléfono pago móvil |
| `PAYMENT_NATIONAL_ID` | ⬜ | Cédula pago móvil |
| `EXCHANGE_RATE_CURRENCY` | ⬜ | Moneda (default: EUR_BCV) |

---

## Scripts disponibles

```bash
# Desarrollo
npm run dev              # Servidor local en http://localhost:3000
npm run build            # Build de producción (detecta errores TypeScript)
npm run start            # Servidor de producción local

# Base de datos
npm run db:generate      # Regenerar cliente Prisma (tras cambios en schema)
npm run db:migrate       # Crear y aplicar migration en desarrollo
npm run db:migrate:prod  # Aplicar migrations existentes en producción
npm run db:push          # Push del schema sin migration (solo dev/prototipado)
npm run db:seed          # Cargar datos iniciales (equipos, partidos)
npm run db:studio        # Abrir Prisma Studio (UI visual de la BD)
npm run db:reset         # ⚠️ Borrar y recrear BD (solo desarrollo)
```

---

## Checklist antes de publicar

### Base de datos
- [ ] Proyecto Supabase creado
- [ ] `DATABASE_URL` configurado con puerto 6543 (pgbouncer)
- [ ] `DIRECT_URL` configurado con puerto 5432 (conexión directa)
- [ ] `npx prisma migrate deploy` ejecutado sin errores
- [ ] `npm run db:seed` ejecutado (equipos y partidos visibles)
- [ ] Admin accesible en `/admin`

### Build y despliegue
- [ ] `npm run build` pasa localmente sin errores
- [ ] `.env` no está en el repositorio de GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy exitoso en Vercel
- [ ] URL pública accesible

### Configuración de la quiniela
- [ ] Datos de pago móvil correctos en configuración admin
- [ ] Tasa Euro BCV funciona en `/api/exchange-rate`
- [ ] Fecha límite de inscripción configurada
- [ ] Ranking visible

### Pruebas funcionales
- [ ] Registro de participante completo
- [ ] Predicciones de los 72 partidos
- [ ] Confirmación de quiniela
- [ ] Reporte de pago
- [ ] Ranking actualizado
- [ ] Admin: gestión de pagos y resultados
- [ ] Prueba desde celular (responsive)

### Seguridad
- [ ] `.env` real no está en GitHub
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo en backend
- [ ] `DATABASE_URL` no expuesto en frontend
- [ ] Ruta `/admin` protegida con autenticación
- [ ] `NEXTAUTH_SECRET` es un string aleatorio seguro
- [ ] No hay datos personales visibles públicamente

---

## Seguridad

### Variables exclusivas del backend (nunca en frontend)

- `DATABASE_URL` / `DIRECT_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `ADMIN_PASSWORD_HASH`

### Variables del frontend (prefijo `NEXT_PUBLIC_`)

Solo estas pueden estar en el cliente:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Protección de rutas admin

El middleware en `proxy.ts` protege todas las rutas `/admin/*`. Sin sesión válida, redirige a `/admin/login`.

### Buenas prácticas

- Cambia `NEXTAUTH_SECRET` en producción — nunca uses el de desarrollo.
- Usa una contraseña de admin larga y aleatoria.
- Los comprobantes de pago deben guardarse en Supabase Storage (bucket privado), nunca en `public/`.
- Activa 2FA en tus cuentas de Supabase y Vercel.
- Revisa periódicamente los logs de Vercel → Functions.

---

## Arquitectura

```
mundial2026/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Landing page pública
│   ├── registro/            # Registro de participantes
│   ├── quiniela/[code]/     # Formulario de predicciones (72 partidos)
│   ├── revision/[code]/     # Revisión antes de confirmar
│   ├── pago/[code]/         # Instrucciones de pago
│   ├── comprobante/[code]/  # Comprobante del participante
│   ├── mi-quiniela/[code]/  # Vista personal con puntuación
│   ├── ranking/             # Ranking público
│   ├── resultados/          # Resultados de partidos
│   ├── estadisticas/        # Estadísticas del torneo
│   ├── admin/               # Panel de administración (protegido)
│   └── api/                 # Backend (API routes)
├── components/              # Componentes React reutilizables
├── lib/
│   ├── prisma.ts            # Cliente Prisma (singleton)
│   ├── exchange-rate.ts     # Tasa EUR/VES desde BCV
│   └── generated/prisma/    # Cliente generado (no editar)
├── prisma/
│   ├── schema.prisma        # Esquema de base de datos
│   ├── seed.ts              # Datos iniciales (equipos, partidos)
│   └── migrations/          # Historial de migraciones SQL
├── public/assets/           # Imágenes y SVGs estáticos
├── prisma.config.ts         # Configuración Prisma 7
├── next.config.ts           # Configuración Next.js
├── .env.example             # Plantilla de variables de entorno
└── README.md                # Este archivo
```
