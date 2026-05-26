import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { ChatService } from "./application/ChatService";
import { AuthService } from "./application/AuthService";
import { CaptchaService } from "./application/CaptchaService";
import { MessageService } from "./application/MessageService";
import { SearchService } from "./application/SearchService";
import { InMemoryCaptchaRepository } from "./infrastructure/InMemoryCaptchaRepository";
import { InMemoryMessageRepository } from "./infrastructure/InMemoryMessageRepository";
import { InMemoryUserRepository } from "./infrastructure/InMemoryUserRepository";
import { AuthController } from "./presentation/controllers/AuthController";
import { CaptchaController } from "./presentation/controllers/CaptchaController";
import { ChatController } from "./presentation/controllers/ChatController";
import { MessageController } from "./presentation/controllers/MessageController";
import { SearchController } from "./presentation/controllers/SearchController";

const app = express();
const router = express.Router();
const port = Number(process.env.PORT ?? 4000);

const captchaRepository = new InMemoryCaptchaRepository();
const userRepository = new InMemoryUserRepository();
const messageRepository = new InMemoryMessageRepository();

const captchaService = new CaptchaService(captchaRepository);
const authService = new AuthService(userRepository, captchaService);
const messageService = new MessageService(messageRepository, captchaService);
const searchService = new SearchService();
const chatService = new ChatService();

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json({ limit: "1mb" }));

router.get("/health", (_request, response) => {
  response.json({
    ok: true,
    message: "API del Portal Horizonte en linea.",
    data: { service: "api", version: "1.0.0" }
  });
});

new CaptchaController(captchaService).register(router);
new AuthController(authService).register(router);
new MessageController(messageService).register(router);
new SearchController(searchService).register(router);
new ChatController(chatService).register(router);

app.use("/api", router);

app.use("/api", (_request, response) => {
  response.status(404).json({
    ok: false,
    message: "Ruta de API no encontrada."
  });
});

const webDistPath = path.resolve(process.cwd(), "apps", "web", "dist");
const webIndexPath = path.join(webDistPath, "index.html");

if (existsSync(webIndexPath)) {
  app.use(express.static(webDistPath));
  app.get("*", (_request, response) => {
    response.sendFile(webIndexPath);
  });
} else {
  app.get("*", (_request, response) => {
    response.status(503).send("Ejecuta npm run build para generar el frontend.");
  });
}

app.listen(port, "127.0.0.1", () => {
  console.log(`API lista en http://127.0.0.1:${port}/api`);
  console.log(`Sitio listo en http://127.0.0.1:${port}`);
});
