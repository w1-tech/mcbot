# Mcbot
MineBot-Bedrock: Minecraft Bedrock Edition Companion Bot
 
I. Project Introduction
 
MineBot-Bedrock is a companion bot designed for Minecraft Bedrock Edition servers. Developed with Node.js and  bedrock-protocol , it uses a Finite State Machine (FSM) to implement features like player following, combat protection, and farming collaboration. It enhances the gameplay experience and supports local browser-based state debugging.
 
II. Core Features
 
(1) Basic Interaction
 
- Follow Players: Responds to player commands ( !follow <playername> ) and synchronizes movement to the target player's coordinates.
- Combat Protection: Listens for hostile mob spawns, automatically enters combat state, and initiates attacks to protect the player.
 
(2) Survival Collaboration
 
- State Adaptation: Intelligently switches states based on scenarios, including IDLE, FIGHTING, FARMING, etc. Supports future expansion of behaviors like fishing, sleeping, and eating.
- Debug Support: Starts a local HTTP server ( http://localhost:8888 ) to display real-time FSM state transitions, facilitating development and debugging.
 
III. Dependencies
 
- Runtime Environment: Node.js (v16+ recommended)
- Core Dependencies:
-  bedrock-protocol : Enables interaction with Bedrock Edition server protocols for connection and packet transmission.
-  rxjs : Manages FSM state transitions to ensure timely logic responses.
- Development Dependencies:
-  typescript : Compiles TypeScript code for improved readability and maintainability.
-  @types/node : Provides Node.js type definitions for TypeScript compatibility.
 
IV. Deployment & Usage
 
(1) Project Initialization
 
1. Clone/Download the Project
Pull the code repository to your local machine, ensuring the directory structure is complete (including  src/ ,  package.json , etc.).
2. Install Dependencies
Open a terminal, navigate to the project root directory, and run:
npm install
 
 
(2) Configuration Adjustment
 
1. Server Connection
Edit  BOT_CONFIG  in  src/index.ts :
const BOT_CONFIG = {
  server: 'your-server-ip:19132', // Replace with your server address
  username: 'MineBot',           // Custom bot name
  offline: true,                 // Offline mode; disable for online servers
};
 
2. Feature Adaptation
To enhance farming, fishing, etc., extend event listeners in  src/index.ts  (e.g., handle block updates via  on('update_block') ).
 
(3) Startup Process
 
1. Compile Code
Generate executable JavaScript files by running:
npm run build
 
2. Start the Bot
Run the compiled code to connect to the server:
npm run start
 
3. Debug & Verification
- In-game, send commands like  !follow your-ign  to test the following feature.
- Visit  http://localhost:8888  in a browser to view real-time FSM states.
 
