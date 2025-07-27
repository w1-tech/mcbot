import { createServer } from 'http';
import { BehaviorSubject } from 'rxjs';
import type { BotState } from './index';
/**
 * 启动本地 HTTP 服务，暴露 FSM 状态
 * 浏览器访问: http://localhost:8888
 */
export function startDebugServer(state$: BehaviorSubject<BotState>) {
  const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      state: state$.value,
      timestamp: new Date().toISOString(),
    }));
  });
  server.listen(8888, () => {
    console.log('🔧 本地调试服务启动: http://localhost:8888');
  });
}
