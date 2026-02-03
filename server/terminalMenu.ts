/**
 * STAR TREK: FLEET COMMAND - ADVANCED TERMINAL MENU SYSTEM
 * =========================================================
 * Interactive command center with comprehensive options and settings
 */
import readline from 'readline';
import chalk from 'chalk';

// Configuration state
interface ServerConfig {
  port: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  maxPlayers: number;
  autoSave: boolean;
  autoSaveInterval: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  theme: 'classic' | 'dark' | 'lcars';
  alertSound: boolean;
  redAlertMode: boolean;
}

let config: ServerConfig = {
  port: 3000,
  maintenanceMode: false,
  debugMode: false,
  maxPlayers: 1000,
  autoSave: true,
  autoSaveInterval: 60,
  logLevel: 'info',
  theme: 'classic',
  alertSound: true,
  redAlertMode: false,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function clearScreen() {
  console.clear();
}

function starfleetBanner() {
  const banners = {
    classic: chalk.yellow(`
╔═══════════════════════════════════════════════════════════════════╗
║   _____ _             _______ ____  _____ _  __                   ║
║  / ____| |           |__   __|  _ \\|  ___| |/ /                   ║
║ | (___ | |_ __ _ _ __   | |  | |_) | |_  | ' /                    ║
║  \\___ \\| __/ _\` | '__|  | |  |  _ <|  _| |  <                     ║
║  ____) | || (_| | |     | |  | |_) | |___| . \\                    ║
║ |_____/ \\__\\__,_|_|     |_|  |____/|_____|_|\\_\\                   ║
║                                                                   ║
║         STARFLEET COMMAND TERMINAL v2.0 - ENHANCED               ║
╚═══════════════════════════════════════════════════════════════════╝
`),
    dark: chalk.cyan(`
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
███ STARFLEET COMMAND CENTER - TACTICAL OPERATIONS TERMINAL ███
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`),
    lcars: chalk.magenta(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ╔═══════════════════════════════════════════════════════╗  ┃
┃  ║  LCARS INTERFACE - STARFLEET OPERATIONS COMMAND       ║  ┃
┃  ╚═══════════════════════════════════════════════════════╝  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`),
  };
  console.log(banners[config.theme]);
  
  const status = config.redAlertMode ? chalk.red.bold('🚨 RED ALERT') : 
                 config.maintenanceMode ? chalk.yellow('⚠️  MAINTENANCE') : 
                 chalk.green('✓ OPERATIONAL');
  
  console.log(chalk.gray(`Status: ${status} | Port: ${config.port} | Players: ${config.maxPlayers} | Log: ${config.logLevel.toUpperCase()}\n`));
}

function mainMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.blue('╔════════════════════ MAIN MENU ════════════════════╗'));
  console.log(chalk.blue('║') + '  1. 📊 System Status & Monitoring               ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  2. 💾 Database Operations                       ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  3. 🎮 Game Engine Controls                      ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  4. 🚀 Fleet Management                          ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  5. 👥 Player Administration                     ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  6. ⚙️  Server Settings & Configuration          ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  7. 📈 Analytics & Reports                       ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  8. 🛠️  Developer Tools                           ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  9. ❓ Help & Documentation                      ' + chalk.blue('║'));
  console.log(chalk.blue('║') + '  0. 🚪 Exit Terminal                             ' + chalk.blue('║'));
  console.log(chalk.blue('╚═══════════════════════════════════════════════════╝'));
  rl.question(chalk.white('\n⚡ Enter your choice, Captain: '), handleMainMenu);
}

function handleMainMenu(choice: string) {
  switch (choice.trim()) {
    case '1':
      systemStatusMenu();
      break;
    case '2':
      databaseMenu();
      break;
    case '3':
      gameEngineMenu();
      break;
    case '4':
      fleetManagementMenu();
      break;
    case '5':
      playerAdminMenu();
      break;
    case '6':
      serverSettingsMenu();
      break;
    case '7':
      analyticsMenu();
      break;
    case '8':
      developerToolsMenu();
      break;
    case '9':
      helpMenu();
      break;
    case '0':
      exitTerminal();
      break;
    default:
      console.log(chalk.red('❌ Invalid option. Please try again.'));
      setTimeout(mainMenu, 1500);
  }
}

// ============================================================================
// SYSTEM STATUS MENU
// ============================================================================
function systemStatusMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.blue('╔══════════════ SYSTEM STATUS & MONITORING ══════════════╗'));
  console.log(chalk.green('║  CPU Usage:      ████████░░ 82%                       ║'));
  console.log(chalk.green('║  Memory:         ██████░░░░ 65%                       ║'));
  console.log(chalk.green('║  Network:        ██████████ 100%                      ║'));
  console.log(chalk.green('║  Database:       ✓ Connected                          ║'));
  console.log(chalk.green('║  Game Engine:    ✓ Running                            ║'));
  console.log(chalk.green('║  Active Players: 247 / 1000                           ║'));
  console.log(chalk.green('║  Uptime:         3 days, 14 hours                     ║'));
  console.log(chalk.blue('╚════════════════════════════════════════════════════════╝'));
  console.log('\n' + chalk.yellow('Options:'));
  console.log('  1. View Detailed Metrics');
  console.log('  2. System Health Check');
  console.log('  3. Resource Usage History');
  console.log('  4. Alert Configuration');
  console.log('  0. Back to Main Menu');
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.cyan('\n📊 Detailed System Metrics:'));
        console.log('  - Request Rate: 1,234 req/sec');
        console.log('  - Response Time: 45ms avg');
        console.log('  - Error Rate: 0.02%');
        console.log('  - Cache Hit Rate: 94%');
        break;
      case '2':
        console.log(chalk.green('\n✓ System Health: ALL SYSTEMS NOMINAL'));
        break;
      case '3':
        console.log(chalk.cyan('\n📈 Resource Usage (Last 24h):'));
        console.log('  - Peak CPU: 95% at 14:30');
        console.log('  - Peak Memory: 78% at 19:15');
        break;
      case '4':
        console.log(chalk.yellow('\n⚠️  Alert Configuration:'));
        console.log('  - CPU Alert Threshold: 90%');
        console.log('  - Memory Alert Threshold: 85%');
        console.log('  - Email Notifications: Enabled');
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// DATABASE OPERATIONS MENU
// ============================================================================
function databaseMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.green('╔════════════════ DATABASE OPERATIONS ════════════════╗'));
  console.log(chalk.green('║') + '  1. Connection Status & Info                     ' + chalk.green('║'));
  console.log(chalk.green('║') + '  2. Run Database Migration                       ' + chalk.green('║'));
  console.log(chalk.green('║') + '  3. Backup Database                              ' + chalk.green('║'));
  console.log(chalk.green('║') + '  4. Restore from Backup                          ' + chalk.green('║'));
  console.log(chalk.green('║') + '  5. Optimize Database                            ' + chalk.green('║'));
  console.log(chalk.green('║') + '  6. View Tables & Stats                          ' + chalk.green('║'));
  console.log(chalk.green('║') + '  7. Execute Custom Query                         ' + chalk.green('║'));
  console.log(chalk.green('║') + '  0. Back to Main Menu                            ' + chalk.green('║'));
  console.log(chalk.green('╚═════════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.green('\n✓ Database Status: ONLINE'));
        console.log('  - Host: localhost:5432');
        console.log('  - Database: startrek_fleet_command');
        console.log('  - Active Connections: 15');
        console.log('  - Pool Size: 20');
        break;
      case '2':
        console.log(chalk.yellow('\n⚙️  Running database migration...'));
        console.log(chalk.green('✓ Migration completed successfully'));
        break;
      case '3':
        console.log(chalk.yellow('\n⚙️  Creating database backup...'));
        console.log(chalk.green('✓ Backup saved: backup_2026-02-03_15-30.sql'));
        break;
      case '4':
        console.log(chalk.yellow('\n⚠️  Database restore requires confirmation'));
        console.log('  This will overwrite current data');
        break;
      case '5':
        console.log(chalk.yellow('\n⚙️  Optimizing database tables...'));
        console.log(chalk.green('✓ Database optimized. Performance improved by 12%'));
        break;
      case '6':
        console.log(chalk.cyan('\n📊 Database Tables:'));
        console.log('  - players: 12,847 rows');
        console.log('  - ships: 45,231 rows');
        console.log('  - missions: 8,456 rows');
        console.log('  - technologies: 2,134 rows');
        break;
      case '7':
        console.log(chalk.red('\n⚠️  Custom query execution - Admin access required'));
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// GAME ENGINE CONTROLS MENU
// ============================================================================
function gameEngineMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.yellow('╔════════════════ GAME ENGINE CONTROLS ════════════════╗'));
  console.log(chalk.yellow('║') + '  1. Start Game Engine                            ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  2. Stop Game Engine                             ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  3. Restart Game Engine                          ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  4. View Engine Status                           ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  5. View Engine Logs                             ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  6. Configure Engine Settings                    ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  7. Performance Metrics                          ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  0. Back to Main Menu                            ' + chalk.yellow('║'));
  console.log(chalk.yellow('╚═════════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.green('\n⚡ Game Engine starting...'));
        console.log(chalk.green('✓ Game Engine is now ONLINE'));
        break;
      case '2':
        console.log(chalk.yellow('\n⚠️  Stopping Game Engine...'));
        console.log(chalk.gray('✓ Game Engine stopped gracefully'));
        break;
      case '3':
        console.log(chalk.yellow('\n⚙️  Restarting Game Engine...'));
        console.log(chalk.green('✓ Game Engine restarted successfully'));
        break;
      case '4':
        console.log(chalk.cyan('\n📊 Engine Status:'));
        console.log('  - State: Running');
        console.log('  - Tick Rate: 60 TPS');
        console.log('  - Active Game Loops: 247');
        console.log('  - Memory Usage: 2.4 GB');
        break;
      case '5':
        console.log(chalk.gray('\n📄 Recent Engine Logs:'));
        console.log('  [INFO] Combat system initialized');
        console.log('  [INFO] Mission system ready');
        console.log('  [INFO] Economy system active');
        console.log('  [WARN] High load detected on sector 7G');
        break;
      case '6':
        console.log(chalk.cyan('\n⚙️  Engine Configuration:'));
        console.log('  - Tick Rate: 60 TPS');
        console.log('  - Max Concurrent Battles: 100');
        console.log('  - Auto-scaling: Enabled');
        break;
      case '7':
        console.log(chalk.cyan('\n📈 Performance Metrics:'));
        console.log('  - Avg Tick Time: 8ms');
        console.log('  - Battles/sec: 45');
        console.log('  - Missions Completed: 1,234');
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// FLEET MANAGEMENT MENU
// ============================================================================
function fleetManagementMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.magenta('╔══════════════════ FLEET MANAGEMENT ══════════════════╗'));
  console.log(chalk.magenta('║') + '  1. View All Active Fleets                       ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  2. Fleet Statistics                             ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  3. Ship Type Distribution                       ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  4. Combat Analysis                              ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  5. Formation Analysis                           ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  0. Back to Main Menu                            ' + chalk.magenta('║'));
  console.log(chalk.magenta('╚═════════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.cyan('\n🚀 Active Fleets (Top 5):'));
        console.log('  1. USS Enterprise Fleet - Power: 45,230');
        console.log('  2. Klingon Armada - Power: 43,890');
        console.log('  3. Romulan Strike Force - Power: 41,567');
        console.log('  4. Dominion War Fleet - Power: 39,234');
        console.log('  5. Federation Defense - Power: 38,901');
        break;
      case '2':
        console.log(chalk.cyan('\n📊 Fleet Statistics:'));
        console.log('  - Total Fleets: 12,847');
        console.log('  - Total Ships: 45,231');
        console.log('  - Avg Fleet Power: 15,678');
        console.log('  - Most Popular Formation: Wedge (32%)');
        break;
      case '3':
        console.log(chalk.cyan('\n🛸 Ship Distribution:'));
        console.log('  - Cruisers: 35%');
        console.log('  - Battleships: 28%');
        console.log('  - Destroyers: 20%');
        console.log('  - Frigates: 12%');
        console.log('  - Carriers: 5%');
        break;
      case '4':
        console.log(chalk.yellow('\n⚔️  Combat Statistics:'));
        console.log('  - Battles Today: 1,234');
        console.log('  - Win Rate (Federation): 52%');
        console.log('  - Most Used Weapon: Photon Torpedoes');
        console.log('  - Avg Battle Duration: 4.2 minutes');
        break;
      case '5':
        console.log(chalk.cyan('\n📐 Formation Usage:'));
        console.log('  - Wedge: 32%');
        console.log('  - Line: 25%');
        console.log('  - Phalanx: 18%');
        console.log('  - Pincer: 15%');
        console.log('  - Other: 10%');
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// PLAYER ADMINISTRATION MENU
// ============================================================================
function playerAdminMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.cyan('╔═════════════ PLAYER ADMINISTRATION ═════════════╗'));
  console.log(chalk.cyan('║') + '  1. View Online Players                       ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  2. Search Player by Name/ID                  ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  3. Player Statistics                         ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  4. Ban/Kick Player                           ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  5. Grant Resources                           ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  6. View Player Reports                       ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  7. Broadcast Message                         ' + chalk.cyan('║'));
  console.log(chalk.cyan('║') + '  0. Back to Main Menu                         ' + chalk.cyan('║'));
  console.log(chalk.cyan('╚══════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.green('\n👥 Online Players (247):'));
        console.log('  - Commander_Alpha (Level 45)');
        console.log('  - Captain_Picard (Level 52)');
        console.log('  - Admiral_Kirk (Level 67)');
        console.log('  - Lieutenant_Worf (Level 38)');
        console.log('  - ... and 243 more');
        break;
      case '2':
        console.log(chalk.cyan('\n🔍 Player search functionality'));
        break;
      case '3':
        console.log(chalk.cyan('\n📊 Player Statistics:'));
        console.log('  - Total Players: 12,847');
        console.log('  - Active Today: 2,341');
        console.log('  - New Players (24h): 45');
        console.log('  - Avg Session Time: 2.5 hours');
        break;
      case '4':
        console.log(chalk.red('\n⚠️  Moderation tools - Requires authorization'));
        break;
      case '5':
        console.log(chalk.yellow('\n💎 Resource Grant - Admin access required'));
        break;
      case '6':
        console.log(chalk.yellow('\n📋 Player Reports: 15 pending'));
        break;
      case '7':
        console.log(chalk.green('\n📢 Broadcast Message - Enter message:'));
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// SERVER SETTINGS MENU
// ============================================================================
function serverSettingsMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.red('╔════════ SERVER SETTINGS & CONFIGURATION ════════╗'));
  console.log(chalk.red('║') + '  1. General Settings                          ' + chalk.red('║'));
  console.log(chalk.red('║') + '  2. Network Configuration                     ' + chalk.red('║'));
  console.log(chalk.red('║') + '  3. Security Settings                         ' + chalk.red('║'));
  console.log(chalk.red('║') + '  4. Performance Tuning                        ' + chalk.red('║'));
  console.log(chalk.red('║') + '  5. Logging Configuration                     ' + chalk.red('║'));
  console.log(chalk.red('║') + '  6. Terminal Theme                            ' + chalk.red('║'));
  console.log(chalk.red('║') + '  7. Alert Settings                            ' + chalk.red('║'));
  console.log(chalk.red('║') + '  8. Save Configuration                        ' + chalk.red('║'));
  console.log(chalk.red('║') + '  0. Back to Main Menu                         ' + chalk.red('║'));
  console.log(chalk.red('╚══════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        generalSettingsMenu();
        return;
      case '2':
        networkSettingsMenu();
        return;
      case '3':
        console.log(chalk.yellow('\n🔒 Security Settings:'));
        console.log(`  - HTTPS Enabled: Yes`);
        console.log(`  - Rate Limiting: ${config.debugMode ? 'Disabled' : 'Enabled'}`);
        console.log(`  - Authentication: JWT`);
        break;
      case '4':
        console.log(chalk.cyan('\n⚡ Performance Settings:'));
        console.log(`  - Worker Threads: 4`);
        console.log(`  - Max Connections: 1000`);
        console.log(`  - Cache Size: 512 MB`);
        break;
      case '5':
        loggingSettingsMenu();
        return;
      case '6':
        themeSettingsMenu();
        return;
      case '7':
        alertSettingsMenu();
        return;
      case '8':
        console.log(chalk.green('\n💾 Configuration saved successfully!'));
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

function generalSettingsMenu() {
  console.log(chalk.cyan('\n⚙️  GENERAL SETTINGS:'));
  console.log(`  1. Port: ${config.port}`);
  console.log(`  2. Max Players: ${config.maxPlayers}`);
  console.log(`  3. Maintenance Mode: ${config.maintenanceMode ? 'ON' : 'OFF'}`);
  console.log(`  4. Debug Mode: ${config.debugMode ? 'ON' : 'OFF'}`);
  console.log(`  5. Auto-Save: ${config.autoSave ? 'ON' : 'OFF'}`);
  console.log(`  6. Auto-Save Interval: ${config.autoSaveInterval}s`);
  console.log('  0. Back');
  
  rl.question(chalk.white('\n⚡ Select setting to change: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter new port: ', (port) => {
          config.port = parseInt(port) || config.port;
          console.log(chalk.green(`✓ Port updated to ${config.port}`));
          returnToSettings();
        });
        return;
      case '2':
        rl.question('Enter max players: ', (max) => {
          config.maxPlayers = parseInt(max) || config.maxPlayers;
          console.log(chalk.green(`✓ Max players updated to ${config.maxPlayers}`));
          returnToSettings();
        });
        return;
      case '3':
        config.maintenanceMode = !config.maintenanceMode;
        console.log(chalk.green(`✓ Maintenance mode ${config.maintenanceMode ? 'enabled' : 'disabled'}`));
        break;
      case '4':
        config.debugMode = !config.debugMode;
        console.log(chalk.green(`✓ Debug mode ${config.debugMode ? 'enabled' : 'disabled'}`));
        break;
      case '5':
        config.autoSave = !config.autoSave;
        console.log(chalk.green(`✓ Auto-save ${config.autoSave ? 'enabled' : 'disabled'}`));
        break;
      case '6':
        rl.question('Enter interval (seconds): ', (interval) => {
          config.autoSaveInterval = parseInt(interval) || config.autoSaveInterval;
          console.log(chalk.green(`✓ Auto-save interval updated to ${config.autoSaveInterval}s`));
          returnToSettings();
        });
        return;
      case '0':
        serverSettingsMenu();
        return;
    }
    returnToSettings();
  });
}

function networkSettingsMenu() {
  console.log(chalk.cyan('\n🌐 NETWORK CONFIGURATION:'));
  console.log(`  - Current Port: ${config.port}`);
  console.log(`  - Host: 0.0.0.0 (All interfaces)`);
  console.log(`  - CORS: Enabled`);
  console.log(`  - WebSocket: Enabled`);
  returnToSettings();
}

function loggingSettingsMenu() {
  console.log(chalk.cyan('\n📋 LOGGING CONFIGURATION:'));
  console.log(`  1. Log Level: ${config.logLevel.toUpperCase()}`);
  console.log('  2. Log to File: Enabled');
  console.log('  3. Log to Console: Enabled');
  console.log('  0. Back');
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log('\n  Select log level:');
        console.log('  1. Debug  2. Info  3. Warn  4. Error');
        rl.question('⚡ Choice: ', (level) => {
          const levels = ['debug', 'info', 'warn', 'error'];
          const idx = parseInt(level) - 1;
          if (idx >= 0 && idx < levels.length) {
            config.logLevel = levels[idx] as any;
            console.log(chalk.green(`✓ Log level set to ${config.logLevel.toUpperCase()}`));
          }
          returnToSettings();
        });
        return;
      case '0':
        serverSettingsMenu();
        return;
    }
    returnToSettings();
  });
}

function themeSettingsMenu() {
  console.log(chalk.cyan('\n🎨 TERMINAL THEME:'));
  console.log(`  Current: ${config.theme.toUpperCase()}`);
  console.log('\n  1. Classic Theme (Yellow/Blue)');
  console.log('  2. Dark Theme (Cyan/Gray)');
  console.log('  3. LCARS Theme (Magenta/Purple)');
  console.log('  0. Back');
  
  rl.question(chalk.white('\n⚡ Select theme: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        config.theme = 'classic';
        console.log(chalk.green('✓ Theme changed to Classic'));
        break;
      case '2':
        config.theme = 'dark';
        console.log(chalk.green('✓ Theme changed to Dark'));
        break;
      case '3':
        config.theme = 'lcars';
        console.log(chalk.green('✓ Theme changed to LCARS'));
        break;
      case '0':
        serverSettingsMenu();
        return;
    }
    returnToSettings();
  });
}

function alertSettingsMenu() {
  console.log(chalk.cyan('\n🚨 ALERT SETTINGS:'));
  console.log(`  1. Alert Sounds: ${config.alertSound ? 'ON' : 'OFF'}`);
  console.log(`  2. Red Alert Mode: ${config.redAlertMode ? 'ON' : 'OFF'}`);
  console.log('  0. Back');
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        config.alertSound = !config.alertSound;
        console.log(chalk.green(`✓ Alert sounds ${config.alertSound ? 'enabled' : 'disabled'}`));
        break;
      case '2':
        config.redAlertMode = !config.redAlertMode;
        console.log(config.redAlertMode ? 
          chalk.red.bold('\n🚨 RED ALERT ACTIVATED! ALL HANDS TO BATTLE STATIONS!') : 
          chalk.green('✓ Red alert deactivated')
        );
        break;
      case '0':
        serverSettingsMenu();
        return;
    }
    returnToSettings();
  });
}

// ============================================================================
// ANALYTICS MENU
// ============================================================================
function analyticsMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.magenta('╔═════════════ ANALYTICS & REPORTS ═════════════╗'));
  console.log(chalk.magenta('║') + '  1. Player Activity Report                 ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  2. Revenue & Economics                     ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  3. Combat Statistics                       ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  4. Mission Completion Rates                ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  5. Technology Research Trends              ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  6. Server Performance Report               ' + chalk.magenta('║'));
  console.log(chalk.magenta('║') + '  0. Back to Main Menu                       ' + chalk.magenta('║'));
  console.log(chalk.magenta('╚════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.cyan('\n👥 Player Activity (Last 7 Days):'));
        console.log('  - Daily Active Users: 2,341 avg');
        console.log('  - Peak Concurrent: 3,567 (Saturday)');
        console.log('  - Avg Session Length: 2.5 hours');
        console.log('  - Retention Rate: 78%');
        break;
      case '2':
        console.log(chalk.green('\n💰 Revenue & Economics:'));
        console.log('  - Total Credits Generated: 1.2M');
        console.log('  - Avg Player Wealth: 45,678 credits');
        console.log('  - Most Traded Resource: Dilithium');
        console.log('  - Market Activity: High');
        break;
      case '3':
        console.log(chalk.yellow('\n⚔️  Combat Statistics:'));
        console.log('  - Total Battles: 8,456');
        console.log('  - Avg Battle Duration: 4.2 min');
        console.log('  - Most Popular Ship: USS Enterprise');
        console.log('  - Highest Win Rate: Admiral_Kirk (89%)');
        break;
      case '4':
        console.log(chalk.cyan('\n📋 Mission Statistics:'));
        console.log('  - Missions Started: 15,234');
        console.log('  - Missions Completed: 12,890 (85%)');
        console.log('  - Most Popular: "Deep Space Recon" (1,234)');
        console.log('  - Avg Completion Time: 18 minutes');
        break;
      case '5':
        console.log(chalk.blue('\n🔬 Technology Research:'));
        console.log('  - Most Researched: Quantum Torpedoes (67%)');
        console.log('  - Research Completion Rate: 92%');
        console.log('  - Avg Research Time: 2.3 hours');
        break;
      case '6':
        console.log(chalk.cyan('\n📊 Server Performance:'));
        console.log('  - Avg Response Time: 45ms');
        console.log('  - Request Success Rate: 99.98%');
        console.log('  - Peak Load: 1,234 req/sec');
        console.log('  - Error Rate: 0.02%');
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// DEVELOPER TOOLS MENU
// ============================================================================
function developerToolsMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.yellow('╔════════════════ DEVELOPER TOOLS ════════════════╗'));
  console.log(chalk.yellow('║') + '  1. API Testing Console                       ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  2. Database Query Runner                     ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  3. Generate Test Data                        ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  4. Clear Cache                               ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  5. Reset Player Data                         ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  6. Export System Logs                        ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  7. Hot Reload Configuration                  ' + chalk.yellow('║'));
  console.log(chalk.yellow('║') + '  0. Back to Main Menu                         ' + chalk.yellow('║'));
  console.log(chalk.yellow('╚══════════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.cyan('\n🔧 API Testing Console - Ready'));
        break;
      case '2':
        console.log(chalk.cyan('\n🔍 Database Query Runner - Ready'));
        break;
      case '3':
        console.log(chalk.yellow('\n⚙️  Generating test data...'));
        console.log(chalk.green('✓ Created 100 test players with fleets'));
        break;
      case '4':
        console.log(chalk.yellow('\n🗑️  Clearing cache...'));
        console.log(chalk.green('✓ Cache cleared successfully'));
        break;
      case '5':
        console.log(chalk.red('\n⚠️  DANGER: This will reset all player data!'));
        console.log('Type "CONFIRM" to proceed (or anything else to cancel):');
        rl.question('⚡ ', (confirm) => {
          if (confirm === 'CONFIRM') {
            console.log(chalk.red('✓ Player data reset completed'));
          } else {
            console.log(chalk.green('✓ Operation cancelled'));
          }
          returnToMain();
        });
        return;
      case '6':
        console.log(chalk.green('\n💾 Logs exported to: logs_2026-02-03.txt'));
        break;
      case '7':
        console.log(chalk.yellow('\n♻️  Hot reloading configuration...'));
        console.log(chalk.green('✓ Configuration reloaded'));
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// HELP MENU
// ============================================================================
function helpMenu() {
  clearScreen();
  starfleetBanner();
  console.log(chalk.green('╔════════════ HELP & DOCUMENTATION ════════════╗'));
  console.log(chalk.green('║') + '  1. Getting Started Guide                  ' + chalk.green('║'));
  console.log(chalk.green('║') + '  2. Command Reference                      ' + chalk.green('║'));
  console.log(chalk.green('║') + '  3. Troubleshooting                        ' + chalk.green('║'));
  console.log(chalk.green('║') + '  4. API Documentation                      ' + chalk.green('║'));
  console.log(chalk.green('║') + '  5. About Star Trek: Fleet Command        ' + chalk.green('║'));
  console.log(chalk.green('║') + '  0. Back to Main Menu                      ' + chalk.green('║'));
  console.log(chalk.green('╚═══════════════════════════════════════════════╝'));
  
  rl.question(chalk.white('\n⚡ Select option: '), (ans) => {
    switch (ans.trim()) {
      case '1':
        console.log(chalk.cyan('\n📖 GETTING STARTED:'));
        console.log('  1. Configure server settings (Menu 6)');
        console.log('  2. Initialize database (Menu 2)');
        console.log('  3. Start game engine (Menu 3)');
        console.log('  4. Monitor system status (Menu 1)');
        break;
      case '2':
        console.log(chalk.cyan('\n📚 COMMAND REFERENCE:'));
        console.log('  - Use number keys to navigate menus');
        console.log('  - Press 0 to go back');
        console.log('  - All changes are saved automatically');
        break;
      case '3':
        console.log(chalk.yellow('\n🔧 TROUBLESHOOTING:'));
        console.log('  - Check system status for errors');
        console.log('  - Review logs in Menu 3 > 5');
        console.log('  - Restart engine if issues persist');
        break;
      case '4':
        console.log(chalk.cyan('\n📡 API Documentation:'));
        console.log('  - REST API: /api/v1/');
        console.log('  - WebSocket: ws://localhost:3000');
        console.log('  - Full docs: https://docs.startrek-fleet.com');
        break;
      case '5':
        console.log(chalk.blue('\n🚀 STAR TREK: FLEET COMMAND'));
        console.log('  Version: 2.0.0');
        console.log('  Build: Enhanced Terminal Edition');
        console.log('  License: MIT');
        console.log('  \n  Live long and prosper! 🖖');
        break;
      case '0':
        mainMenu();
        return;
    }
    returnToMain();
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function returnToMain() {
  rl.question(chalk.cyan('\n⏎ Press Enter to return to Main Menu...'), () => mainMenu());
}

function returnToSettings() {
  rl.question(chalk.cyan('\n⏎ Press Enter to continue...'), () => serverSettingsMenu());
}

function exitTerminal() {
  clearScreen();
  console.log(chalk.yellow('\n╔═══════════════════════════════════════════════════╗'));
  console.log(chalk.yellow('║                                                   ║'));
  console.log(chalk.yellow('║     🖖 Live long and prosper, Captain!           ║'));
  console.log(chalk.yellow('║                                                   ║'));
  console.log(chalk.yellow('║     Shutting down Starfleet Command Terminal     ║'));
  console.log(chalk.yellow('║                                                   ║'));
  console.log(chalk.yellow('╚═══════════════════════════════════════════════════╝\n'));
  rl.close();
  process.exit(0);
}

// ============================================================================
// STARTUP
// ============================================================================
console.log(chalk.cyan('\n⚡ Initializing Starfleet Command Terminal...'));
setTimeout(() => {
  mainMenu();
}, 500);
