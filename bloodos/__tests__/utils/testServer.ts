
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { NextRequest } from 'next/server';

/**
 * Supertest expects a traditional Node.js HTTP Server, but Next.js 13 App Router 
 * uses the modern Web Fetch API Request/Response standards. 
 * 
 * This adapter bridges them so we can run high-speed integration tests 
 * using supertest without having to spin up the entire heavy Next.js build runtime.
 */
export function createTestServer(handlerObj: any) {
    return createServer(async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

            const chunks: Buffer[] = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }
            const rawBody = Buffer.concat(chunks);

            const init: RequestInit = {
                method: req.method,
                headers: req.headers as Record<string, string>,
            };

            if (req.method !== 'GET' && req.method !== 'HEAD' && rawBody.length > 0) {
                init.body = rawBody;
            }

            const nextReq = new NextRequest(url, init as any);

            // Route to correct method handler defined in route.ts (e.g. GET, POST)
            const method = req.method?.toUpperCase() || 'GET';
            const handler = handlerObj[method];

            if (!handler) {
                res.statusCode = 405;
                res.end('Method Not Allowed');
                return;
            }

            // Execute actual Next.js route
            const nextRes = await handler(nextReq);

            // Map back to node res
            res.statusCode = nextRes.status;
            nextRes.headers.forEach((val: string, key: string) => {
                res.setHeader(key, val);
            });

            const resBody = await nextRes.text();
            res.end(resBody);

        } catch (err: unknown) {
            console.error('Test Server Exception:', err);
            res.statusCode = 500;
            res.end('Internal Server Error Tracker');
        }
    });
}
