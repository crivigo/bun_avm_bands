import { Server } from "socket.io";
import {Server as Engine} from "@socket.io/bun-engine";

import { SERVER_CONFIG } from "./config/server-config";

export const creareServer = () => {

    const io=new Server({
        //path: SERVER_CONFIG.path,
        //pingTimeout: SERVER_CONFIG.idleTimeout * 1000
    });

    const engine = new Engine({path: SERVER_CONFIG.path});

    io.bind(engine);

    const { fetch : engineFetch, websocket} = engine.handler();

    const server = Bun.serve({
        port: SERVER_CONFIG.PORT,
        idleTimeout: SERVER_CONFIG.idleTimeout,
        websocket,
        fetch: (req: Request, server: Parameters<typeof engineFetch>[1]) => {
            const url = new URL(req.url);

            if (url.pathname === SERVER_CONFIG.path as string) {
                return engineFetch(req, server);
            }
            return new Response(`<html><body><h1>Hola mundo</h1></body></html>`, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8"
                }
            });
        }
    });

    return server;
}