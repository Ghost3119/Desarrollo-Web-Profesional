# Portal de Servicios Estudiantiles Horizonte

Proyecto para **Saber Hacer Unidad 1** de Desarrollo Web Profesional.

Alumno: **Camacho Ibarra Jorge Jair**  
Repositorio sugerido por la consigna: **camachoibarrajorgejairUnidad1**

## Stack

- Frontend: React + Vite + TypeScript.
- Backend: Express + TypeScript.
- Arquitectura: MVC con separacion por dominio, aplicacion, infraestructura y presentacion.
- Validacion: reglas compartidas entre frontend y backend.
- CAPTCHA: operacion matematica generada por el backend como SVG, sin servicios externos.

## Ejecutar

```bash
npm install
npm run build
npm run start
```

URL local:

```txt
http://127.0.0.1:4000
```

Si PowerShell toma una instalacion rota de npm, usa:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run build
& 'C:\Program Files\nodejs\npm.cmd' run start
```

## Requisitos Cubiertos

| Requisito del PDF | Donde se ve |
| --- | --- |
| Mapa de sitio | `/mapa-del-sitio` |
| Secciones principales | Inicio, Registro, Sesion, Buzon, Ayuda, Contacto |
| Secciones secundarias | Recuperacion de password, Chat, Busqueda |
| Elementos adicionales | Registro, Buzon, Login, Ayuda, Contacto, Mapa, Recuperacion, Chat |
| Pagina de error | Cualquier ruta inexistente, por ejemplo `/ruta-inexistente` |
| Menu de navegacion WEB | Barra superior con ID del sitio y secciones |
| Busquedas en el sitio | `/buscar` y barra de busqueda superior |
| Validacion frontend | Formularios React antes de enviar |
| Validacion backend | Servicios Express responden errores 422 |
| Usuarios humanos | CAPTCHA propio en formularios publicos |
| Paradigma POO | Servicios, controladores, entidades y repositorios como clases |

## Estructura

```txt
apps/
  api/
    src/
      application/      # Casos de uso y servicios
      domain/           # Entidades e interfaces de repositorio
      infrastructure/   # Repositorios en memoria
      presentation/     # Controladores HTTP
  web/
    src/                # React, rutas, formularios y estilos
packages/
  shared/
    src/                # Contratos, contenido del sitio y validadores
```

## Rutas de API

```txt
GET  /api/health
GET  /api/captcha
GET  /api/captcha/:id.svg
POST /api/auth/register
POST /api/auth/login
POST /api/auth/recover-password
POST /api/contact
POST /api/mailbox
GET  /api/search?q=registro
POST /api/chat
```
