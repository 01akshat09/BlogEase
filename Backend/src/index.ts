import { Hono } from "hono";

import { userRoute } from "./routes/userRoute";
import { blogRoute } from "./routes/blogRoute";

const app = new Hono();
app.get("/", (c) => {
  return c.text("Welcome");
})
app.route("/api/v1/user", userRoute);
app.route("/api/v1/blog", blogRoute);

export default app;
