import http, { IncomingMessage, ServerResponse } from "http";
import {
  addItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "../controllers/List";
import { error } from "console";

export const listsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/lists")) {
    const parts = req.url.split("/");
    console.log(parts, "url parts");

    const id = parts[2] ? parseInt(parts[2]) : undefined;

    if (req.method === "GET" && !id) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(getItems()));
      return;
    }

    if (req.method === "GET" && id) {
      if (isNaN(id)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid item id" }));
        return;
      }
      const item = getItemById(id);
      if (!item) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Item not found" }));
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(item));
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        console.log(chunk, "chunk");
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const { name, quantity, status } = JSON.parse(body);
          if (!name || typeof name !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Item name is required" }));
          }
          if (!quantity || typeof quantity !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Item quantity is required" }));
          }
          if (!status || typeof status !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Item status is required" }));
          }

          const statusBoolean =
            (status as string).toLowerCase() === "bought" || status === true;
          const newItem = addItem(name, quantity, statusBoolean);
          res.writeHead(201, { "content-type": "application/json" });
          res.end(JSON.stringify(newItem));
        } catch (error) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }

    if (req.method === "PUT" && id) {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));

      req.on("end", () => {
        try {
          const { name, quantity, status } = JSON.parse(body);
          const statusBoolean =
            (status as string).toLowerCase() === "bought" || status === true;
          const updatedItem = updateItem(id, name, quantity, statusBoolean);

          if (!updatedItem) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Item not found" }));
            return;
          }

          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(updatedItem));
        } catch (err) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }

    if (req.method === "DELETE" && id) {
      const deleted = deleteItem(id);
      if (!deleted) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Item not found" }));
        return;
      }
    }

    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed on /lists" }));
  }
};
