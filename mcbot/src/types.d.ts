import type { Client } from 'bedrock-protocol';
// 扩展机器人客户端类型（可选）
declare module 'bedrock-protocol' {
  interface Client {
    fsm?: import('./index').BotFSM;
  }
}
