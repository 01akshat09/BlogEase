import {
    createPostInput,
    updatePostInput,
  } from "@akshatsharma/common-module-validation";
  import { PrismaClient } from "@prisma/client/edge";
  import { withAccelerate } from "@prisma/extension-accelerate";
  import { Hono } from "hono";
  import { verify } from "hono/jwt";
  
  export const blogRoute = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
    Variables: {
      UserId: string;
    };
  }>();
  
  blogRoute.use("/*", async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("UserId", user.id);
      await next();
    } else {
      c.status(404);
      return c.json({
        message: "Not LoggedIn",
      });
    }
  });
  
  blogRoute.post("/", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = createPostInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({
        message: "Invalid Blog",
      });
    }
    try {
      const createdBlog = await prisma.blog.create({
        data: {
          title: body.title,
          content: body.content,
          published: body.published,
          authorId: c.get("UserId"),
        },
      });
  
      return c.json({
        message: createdBlog.id,
      });
    } catch (error) {
      c.status(411);
      return c.json({
        message: "Blog not posted! Error",
      });
    }
  });
  
  blogRoute.put("/", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid Content" });
    }
  
    try {
      const createdBlog = await prisma.blog.update({
        where: {
          id: body.id,
          authorId: c.get("UserId"),
        },
        data: {
          title: body.title,
          content: body.content,
          published: body.published,
        },
      });
  
      return c.json({
        message: createdBlog.id,
      });
    } catch (error) {
      c.status(411);
      return c.json({
        message: "Blog not Updated! Error",
      });
    }
  });
  
  blogRoute.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const blogs = await prisma.blog.findMany({});
      return c.json({ blogs });
    } catch (error) {
      c.status(403);
      return c.json({
        message: "Cannot get blogs in bulk",
      });
    }
  });
  
  blogRoute.get("/:id", async (c) => {
    const paramsId = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const blogs = await prisma.blog.findUnique({
        where: {
          id: paramsId,
        },
      });
      return c.json({
        blogs,
      });
    } catch (error) {
      c.status(403);
      return c.json({
        message: "Cannot get blog",
      });
    }
  });
  