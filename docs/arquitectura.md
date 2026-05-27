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
