
import { DurableObject } from "cloudflare:workers";

export class BattleRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.hostName = null;
    this.guestName = null;
    this.count = 10;
    this.sockets = new Map();

    for (const ws of this.ctx.getWebSockets()) {
      const meta = ws.deserializeAttachment() || {};
      if (meta.role) this.sockets.set(meta.role, ws);
      if (meta.role === "host") this.hostName = meta.name || "Operator 1";
      if (meta.role === "guest") this.guestName = meta.name || "Operator 2";
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("SludgeQuest Battle Room", { status: 200 });
    }

    const action = url.searchParams.get("action");
    const name = (url.searchParams.get("name") || "").slice(0, 24) || "Operator";
    if (!["create", "join"].includes(action)) {
      return new Response("Bad action", { status: 400 });
    }

    // Use persisted flags to distinguish "never created" from hibernated room.
    const exists = (await this.ctx.storage.get("exists")) === true;

    if (action === "join" && !exists) {
      return new Response("Room not found", { status: 404 });
    }

    const role = action === "create" ? "host" : "guest";
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role, name });
    this.sockets.set(role, server);

    if (role === "host") {
      this.hostName = name;
      await this.ctx.storage.put({ exists: true, hostName: name });
    } else {
      this.guestName = name;
      await this.ctx.storage.put("guestName", name);
    }

    this.broadcast("room_state", {
      host: this.hostName || (await this.ctx.storage.get("hostName")) || "Host",
      guest: this.guestName || (await this.ctx.storage.get("guestName")) || "",
      count: this.count
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    let data;
    try { data = JSON.parse(message); } catch { return; }
    const meta = ws.deserializeAttachment() || {};
    const type = data.type;
    const payload = data.payload || {};

    if (type === "configure" && meta.role === "host") {
      this.count = Math.max(1, Math.min(50, Number(payload.count) || 10));
      await this.ctx.storage.put("count", this.count);
      this.broadcast("room_state", {
        host: this.hostName || await this.ctx.storage.get("hostName") || "Host",
        guest: this.guestName || await this.ctx.storage.get("guestName") || "",
        count: this.count
      });
      return;
    }

    // Host starts and resolves rounds; server is authoritative for room membership/relay.
    if (["start","answer","result","next","finish"].includes(type)) {
      this.broadcast(type, payload);
    }
  }

  async webSocketClose(ws) {
    const meta = ws.deserializeAttachment() || {};
    if (meta.role) this.sockets.delete(meta.role);
    this.broadcast("peer_left", { role: meta.role, name: meta.name });
  }

  async webSocketError(ws) {
    const meta = ws.deserializeAttachment() || {};
    if (meta.role) this.sockets.delete(meta.role);
  }

  broadcast(type, payload) {
    const message = JSON.stringify({ type, payload });
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.send(message); } catch {}
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("SludgeQuest Battle Server OK", {
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    if (url.pathname !== "/battle") return new Response("Not found", { status: 404 });

    const room = (url.searchParams.get("room") || "").toUpperCase();
    if (!/^WW-\d{6}$/.test(room)) return new Response("Bad room code", { status: 400 });

    const id = env.BATTLE_ROOM.idFromName(room);
    const stub = env.BATTLE_ROOM.get(id);
    return stub.fetch(request);
  }
};
