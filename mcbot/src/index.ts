import { createClient, Client } from 'bedrock-protocol';
import { BehaviorSubject } from 'rxjs';
import type { PlayerLocation, PlayerRotation } from 'bedrock-protocol';
// ------------ 1. 机器人配置 ------------ 
const BOT_CONFIG = {
  server: 'localhost:19132', // 服务器 IP:端口（必填）
  username: 'MineBot',       // 机器人名称
  offline: true,             // 离线模式（根据服务器调整）
};
// ------------ 2. 状态机（FSM）定义 ------------ 
export type BotState = 
  | 'IDLE'      // 空闲
  | 'FOLLOWING' // 跟随玩家
  | 'FIGHTING'  // 战斗
  | 'FARMING'   // 农耕
  | 'EATING'    // 进食
  | 'SLEEPING'  // 睡觉
  | 'SWIMMING'  // 游泳
  | 'FISHING';  // 钓鱼
class BotFSM {
  state$ = new BehaviorSubject<BotState>('IDLE');
  targetPlayerName?: string; // 跟随目标玩家名称
  client?: Client;           // 基岩版客户端实例
  constructor(client: Client) {
    this.client = client;
    this.initEventListeners();
  }
  private initEventListeners() {
    // 监听玩家聊天指令
    this.client?.on('text', (packet) => {
      const message = packet.message;
      if (message.startsWith('!follow ')) {
        this.targetPlayerName = message.split(' ')[1];
        this.setState('FOLLOWING');
      }
    });
    // 监听实体生成（敌对生物检测）
    this.client?.on('add_entity', (packet) => {
      if (this.isHostileEntity(packet) && this.state$.value !== 'FIGHTING') {
        this.setState('FIGHTING');
        this.attackEntity(packet.runtime_entity_id);
      }
    });
  }
  // 状态变更
  setState(newState: BotState) {
    this.state$.next(newState);
    console.log(`[FSM] 状态: ${this.state$.value} → ${newState}`);
  }
  // ------------ 3. 核心行为逻辑 ------------ 
  // 跟随玩家（需实现坐标同步）
  async followPlayer(targetPos: PlayerLocation) {
    if (this.state$.value !== 'FOLLOWING') return;
    this.client?.write('move_player', {
      runtime_entity_id: this.client.entityId,
      position: targetPos,
      rotation: { x: 0, y: 0 } as PlayerRotation,
    });
  }
  // 攻击实体
  attackEntity(entityId: bigint) {
    this.client?.write('attack', {
      runtime_entity_id: entityId,
      action: 'start',
    });
  }
  // 模拟：判断敌对生物（需完善实体类型映射）
  private isHostileEntity(packet: any) {
    const hostileEntities = ['minecraft:zombie', 'minecraft:skeleton'];
    return hostileEntities.includes(packet.identifier);
  }
}
// ------------ 4. 机器人启动流程 ------------ 
async function startBot() {
  const client = createClient(BOT_CONFIG);
  const fsm = new BotFSM(client);
  client.on('connect', () => {
    console.log('✅ 机器人已连接到服务器');
    fsm.setState('IDLE');
  });
  client.on('disconnect', (reason) => {
    console.error('❌ 机器人断开连接:', reason);
  });
  // 模拟：每 1 秒尝试跟随玩家（需替换为真实玩家坐标获取）
  setInterval(() => {
    if (fsm.state$.value === 'FOLLOWING' && fsm.targetPlayerName) {
      // 需实现：从服务器获取玩家坐标
      const mockPlayerPos = { x: 100, y: 64, z: 100 } as PlayerLocation;
      fsm.followPlayer(mockPlayerPos);
    }
  }, 1000);
  // 启动调试服务（暴露 FSM 状态）
  await import('./debug-server.ts').then((mod) => 
    mod.startDebugServer(fsm.state$)
  );
}
// 启动机器人
startBot().catch((err) => {
  console.error('机器人启动失败:', err);
  process.exit(1);
});
