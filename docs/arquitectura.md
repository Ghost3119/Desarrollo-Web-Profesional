# Arquitectura

El proyecto usa un monorepo TypeScript para separar frontend, backend y contratos compartidos.

## Backend

El backend sigue una organizacion cercana a Clean Architecture:

- `domain`: entidades del negocio y contratos de repositorio.
- `application`: servicios que ejecutan casos de uso.
- `infrastructure`: implementaciones tecnicas, en este caso repositorios en memoria.
- `presentation`: controladores HTTP que adaptan Express a los servicios.

Tambien se usa MVC:

- Modelo: entidades como `PortalUser`, `PortalMessage` y `CaptchaChallenge`.
- Vista: interfaz React servida como frontend compilado.
- Controlador: clases en `presentation/controllers`.

## Frontend

El frontend usa una arquitectura Feature-Based con componentes compartidos:

```txt
apps/web/src/
  app/                 # Composicion, layout, navegacion y rutas
  features/            # Casos de uso por modulo
    auth/
    chat/
    contact/
    mailbox/
  pages/               # Paginas generales del portal
  shared/              # API client, hooks, helpers y UI reutilizable
  router.ts            # History API del navegador
```

`app/App.tsx` solo decide que pagina renderizar y aplica el layout principal. Las rutas se concentran en `app/routes.ts`.

React maneja rutas de la aplicacion con History API:

- `/`
- `/registro`
- `/login`
- `/recuperar-password`
- `/buzon`
- `/ayuda`
- `/contacto`
- `/mapa-del-sitio`
- `/chat`
- `/buscar`

Las rutas desconocidas renderizan la pagina 404 de la aplicacion.

## Validacion

Las reglas viven en `packages/shared/src/validators.ts`.

El flujo es:

1. El formulario valida en frontend.
2. El frontend envia la peticion al backend.
3. El backend vuelve a validar los datos.
4. Si el formulario requiere usuario humano, se valida el CAPTCHA.
5. El backend responde con `ok`, `message`, `data` y `errors`.

## CAPTCHA

El backend crea una operacion matematica, guarda la respuesta esperada en memoria y expone una imagen SVG:

```txt
GET /api/captcha
GET /api/captcha/:id.svg
```

El formulario envia `captchaId` y `captchaAnswer`. El CAPTCHA se consume despues de validarse para evitar reutilizacion.
## Flujo de navegacion

El portal separa rutas publicas y privadas:

- Publicas: `/`, `/login`, `/registro`, `/recuperar-password`.
- Privadas: `/buzon`, `/ayuda`, `/contacto`, `/mapa-del-sitio`, `/chat`, `/buscar`.

Antes de iniciar sesion, el usuario ve una landing con llamadas a inicio de sesion y registro. Despues de autenticarse, el layout muestra el menu completo, busqueda interna y cierre de sesion.

La sesion del frontend se guarda en `localStorage` con `AuthSessionProvider`. Es una sesion de demostracion para este proyecto; no sustituye tokens JWT, cookies seguras ni persistencia real de usuarios.

## ORM

Actualmente el proyecto no usa ORM. El backend usa repositorios en memoria para mantener el alcance simple de la Unidad 1 y mostrar la separacion por capas.

Si se requiere persistencia real, la opcion recomendada es Prisma con SQLite para desarrollo local. Encaja con la arquitectura actual porque solo habria que reemplazar las implementaciones de `infrastructure/` sin cambiar los controladores ni los servicios de aplicacion.
