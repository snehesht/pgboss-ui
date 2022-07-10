import PgBoss = require('pg-boss');
import * as uWS from 'uWebSockets.js';
import queue, { MonitorStateData, MonitorStateRecord } from './queue';

const port = parseInt(process.env.PORT) || 4201;

function decode(data: ArrayBuffer): string {
  return new TextDecoder('utf-8').decode(data);
}

function encode(data: string): ArrayBuffer {
  return new TextEncoder().encode(data);
}

class wsHandler implements uWS.WebSocketBehavior {
  public maxPayloadLength = 16 * 1024 * 1024;
  public idleTimeout = 8;
  public maxBackpressure = 1024 * 1024;

  open(ws: uWS.WebSocket) {
    console.log('Opening connection', decode(ws.getRemoteAddress()));
  }

  message(ws: uWS.WebSocket, message: ArrayBuffer, isBinary: boolean) {
    const { topic } = JSON.parse(new TextDecoder('utf-8').decode(message));

    // Allow subscriptions on
    // monitor/workers -> Returns `WIP` state every 2 seconds
    // monitor/state -> Returns entire `monitor-state` object
    // monitor/state-by-queue/<QUEUE_NAME> -> Returns MonitorStateRecord for QUEUE_NAME
    if (topic === 'monitor/state') {
      ws.subscribe('monitor/state');
    } else if (topic.includes('monitor/state-by-queue')) {
      ws.subscribe(topic);
    } else if (topic === 'monitor/workers') {
      ws.subscribe('monitor/workers');
    }
  }

  close(ws: uWS.WebSocket, code: number, message: ArrayBuffer) {
    console.log('Closing connection', code, decode(message));
  }
}

const app = uWS
  .App()
  .ws('/events', new wsHandler())
  .get(
    '/health',
    (res: uWS.HttpResponse, _req: uWS.HttpRequest): uWS.HttpResponse =>
      res.end('OK')
  )
  .any('/*', (res: uWS.HttpResponse, _req: uWS.HttpRequest) =>
    res.writeStatus('404').end('Not Found')
  );

// Publish 'monitor-state' events
queue.on('monitor-states', (data: MonitorStateData) => {
  for (const [queue, stats] of Object.entries(data.queues)) {
    app.publish(
      `monitor/state-by-queue/${queue}`,
      encode(JSON.stringify(stats))
    );
  }
  app.publish('monitor/state', encode(JSON.stringify(data)));
});

queue.on('wip', (data: PgBoss.Worker[]) => {
  console.log('WIP', data);
  app.publish('monitor/workers', encode(JSON.stringify(data)));
});

app.listen(port, async (token) => {
  await queue.start();
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});
