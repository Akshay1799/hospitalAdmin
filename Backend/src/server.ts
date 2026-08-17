import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Qlyno backend listening on http://localhost:${env.PORT}`);
});
