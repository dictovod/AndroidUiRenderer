# AndroidUiRenderer
Online Layout Inspector  
`npm install `  
`npm run dev `  
`npm run build`  
`npm run start`  

# Выгрузка XML из Android устройства: 
`C:\adb>adb connect 192.168.0.85:36787`  
`adb devices`  
`adb shell uiautomator dump`  
`adb pull /sdcard/window_dump.xml`  

npm install tsx --save-dev  
C:\Users\user\Desktop\AndroidUiRenderer>npx tsx server/index.ts  
12:13:47 AM [express] Server is running on http://127.0.0.1:5000  
12:14:13 AM [express] POST /api/parse-xml 200 in 27ms :: {"id":1,"xmlContent":"<?xml version='1.0' en…  
Завершить выполнение пакетного файла [Y(да)/N(нет)]? Y  

# Исправленая версия файла C:\Users\user\Desktop\AndroidUiRenderer\server\index.ts
`import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Логирование запросов и их обработки
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Регистрация маршрутов
    const server = await registerRoutes(app);

    // Обработчик ошибок
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Настройка Vite для разработки
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Запуск сервера на порту 5000
    const port = 5000;
    server.listen(port, "127.0.0.1", () => {
      log(`Server is running on http://127.0.0.1:${port}`);
    });
`
  } catch (err) {
    // Логирование ошибок на этапе старта
    console.error("Error starting the server:", err);
  }
})();
