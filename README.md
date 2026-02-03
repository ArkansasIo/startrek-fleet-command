# Star Trek: Fleet Command Online

**A Turn-Based Real-Time Strategy MMORPG set in the Star Trek Universe**

[![Version](https://img.shields.io/badge/version-2.4.7-blue.svg)](https://github.com/ArkansasIo/startrek-fleet-command)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-20.x-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15.x-blue.svg)](https://www.postgresql.org/)

## 🚀 Overview

Star Trek: Fleet Command Online is an advanced web-based MMORPG that combines strategic gameplay with the rich lore of the Star Trek universe. Command your fleet, explore the galaxy, engage in tactical combat, build alliances, and shape the future of the Federation, Klingon Empire, Romulan Star Empire, and beyond.

### Key Features

- **🌌 Massive Galaxy**: Explore all four quadrants with hundreds of star systems, planets, and space stations
- **⚔️ Strategic Combat**: Turn-based tactical battles with authentic Star Trek starships
- **🏗️ Territory Control**: Claim planets, build infrastructure, and manage your empire
- **🤝 Diplomacy & Alliances**: Form alliances, negotiate treaties, or declare war
- **🔬 Technology Research**: Advance through the technology tree to unlock powerful ships and upgrades
- **💰 Dynamic Economy**: Trade resources, establish trade routes, and manage your economy
- **🎵 Immersive Audio**: Authentic Star Trek sound effects and themed audio system
- **📊 Real-Time Statistics**: Live game stats, rankings, and achievements
- **🎮 MMORPG Features**: Persistent universe, player interaction, and ongoing storylines

## 🎯 Game Mechanics

### Turn-Based Strategy
- **Asynchronous Gameplay**: Make strategic decisions on your schedule
- **Turn Processing**: Actions resolve in scheduled turns allowing for tactical planning
- **Resource Management**: Balance dilithium, latinum, and other critical resources
- **Fleet Command**: Manage multiple ships and squadrons simultaneously

### Territory & Exploration
- **Galactic Quadrants**: Alpha, Beta, Gamma, and Delta quadrants to explore
- **Star Systems**: Hundreds of canonical Star Trek locations (Sol, Qo'noS, Romulus, Bajor, etc.)
- **Planet Management**: Colonize worlds, build structures, and extract resources
- **Space Stations**: Construct and upgrade stations like Deep Space Nine

### Combat System
- **Ship Classes**: Command everything from shuttles to Galaxy-class starships
- **Tactical Combat**: Position-based combat with weapons, shields, and special abilities
- **Boss Encounters**: Face iconic threats like the Borg Cube, Dominion Battleship, and more
- **PvP & PvE**: Battle other players or AI-controlled enemies

### Social Features
- **Alliances/Guilds**: Form powerful coalitions with other players
- **Diplomacy**: Negotiate peace, trade agreements, or declarations of war
- **Messaging System**: Communicate with other commanders across the galaxy
- **Rankings & Achievements**: Compete for top positions and earn commendations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** with custom Star Trek theme
- **Radix UI** for accessible components
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL 15** for data persistence
- **Database pooling** for scalability
- **RESTful API** architecture

### Development Tools
- **pnpm** for package management
- **ESLint** for code quality
- **tsx** for TypeScript execution
- **Concurrently** for parallel processes

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 10.x or higher
- **PostgreSQL** 15.x or higher
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ArkansasIo/startrek-fleet-command.git
cd startrek-fleet-command
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Database

Make sure PostgreSQL is installed and running, then:

```bash
# Run the setup script (Windows)
.\setup-database.ps1

# Or manually create the database
createdb startrek_mmorpg
psql -d startrek_mmorpg -f server/database/schema.sql
```

### 4. Configure Environment

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_NAME=startrek_mmorpg
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
NODE_ENV=development
PORT=3000

# Security
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
```

### 5. Run the Development Server

```bash
pnpm dev
```

This starts both the frontend (port 5173) and backend (port 3000) servers.

Visit **http://localhost:5173** to play!

## 📖 Documentation

- **[Database System](DATABASE_MMORPG_SYSTEM.md)** - Complete database schema and architecture
- **[Galactic Territories](GALACTIC_TERRITORIES_SYSTEM.md)** - Territory management system
- **[Audio System](STAR_TREK_AUDIO_SYSTEM.md)** - Sound effects and audio implementation
- **[Megastructures](README_MAGASTRUCTERS.md)** - Massive space structures and projects
- **[Setup Guide](DATABASE_SETUP.md)** - Detailed database setup instructions
- **[Running Guide](README_RUN.md)** - How to run the game

## 🎮 How to Play

### Getting Started
1. **Launch the game** at http://localhost:5173
2. **Create your character** - Choose your division (Command, Operations, Sciences, etc.)
3. **Complete the tutorial** - Learn the basics of fleet command
4. **Explore the galaxy** - Visit star systems and discover new worlds

### Core Gameplay Loop
1. **Build Your Fleet** - Acquire and upgrade starships
2. **Gather Resources** - Mine dilithium, collect latinum, and trade goods
3. **Expand Territory** - Colonize planets and establish control
4. **Research Technology** - Unlock advanced ships and capabilities
5. **Engage in Combat** - Defend your territory and challenge opponents
6. **Form Alliances** - Join or create alliances for mutual benefit
7. **Complete Missions** - Earn rewards and advance the storyline

## 🏗️ Project Structure

```
startrek-fleet-command/
├── client/                 # Frontend React application
│   ├── components/        # React components
│   │   ├── audio/        # Audio system components
│   │   ├── sections/     # Game section components
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Game logic and utilities
│   └── pages/            # Page components
├── server/                # Backend Node.js server
│   ├── database/         # Database connection and schema
│   ├── game/             # Game engine logic
│   ├── routes/           # API routes
│   └── cron/             # Automated game processing
├── public/               # Static assets
│   └── audio/           # Audio files and placeholders
└── shared/              # Shared types and utilities
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Run both client and server in development mode
pnpm dev:client       # Run only the frontend
pnpm dev:server       # Run only the backend

# Building
pnpm build            # Build for production
pnpm build:client     # Build frontend only
pnpm build:server     # Build backend only

# Production
pnpm start            # Start production server
pnpm preview          # Preview production build

# Database
pnpm db:setup         # Initialize database schema
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with sample data

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm test             # Run tests
```

## 🎨 Game Features in Detail

### Ship Classes Available
- **Shuttlecraft** - Small, fast, and agile
- **Runabout** - Multi-purpose utility vessel
- **Bird-of-Prey** - Klingon fast attack ship
- **Defiant-class** - Compact warship
- **Intrepid-class** - Advanced science vessel
- **Galaxy-class** - Flagship explorer
- **Sovereign-class** - Modern battleship
- **Borg Cube** - Assimilated technology (boss encounter)

### Resources to Manage
- **Dilithium Crystals** - Power generation and warp drive fuel
- **Latinum** - Universal currency for trade
- **Duranium** - Ship construction material
- **Tritanium** - Advanced hull plating
- **Biomatter** - Life support and food production
- **Antimatter** - Weapons and propulsion

### Factions & Divisions
- **United Federation of Planets**
  - Command (Red) - Leadership and strategy
  - Operations (Gold) - Engineering and security
  - Sciences (Blue) - Research and medical
- **Klingon Empire** - Warriors and honor
- **Romulan Star Empire** - Cunning and stealth
- **Neutral/Independent** - Forge your own path

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Star Trek** - Created by Gene Roddenberry
- **Paramount Pictures** - Owners of Star Trek IP
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has helped build this project

## 📞 Contact & Links

- **GitHub Repository**: https://github.com/ArkansasIo/startrek-fleet-command
- **Issues & Bug Reports**: https://github.com/ArkansasIo/startrek-fleet-command/issues
- **Discussions**: https://github.com/ArkansasIo/startrek-fleet-command/discussions

## 🌟 Roadmap

### Current Version (2.4.7)
- ✅ Core game mechanics
- ✅ Territory control system
- ✅ Combat system
- ✅ Alliance features
- ✅ Audio system
- ✅ Turn-based gameplay

### Upcoming Features
- 🚧 Multiplayer matchmaking
- 🚧 Advanced diplomacy system
- 🚧 Megastructure construction
- 🚧 Story campaigns
- 🚧 Mobile responsive design
- 🚧 Real-time events
- 🚧 Player trading system
- 🚧 Guild wars

---

**Live Long and Prosper** 🖖

*This is a fan-made project and is not officially affiliated with or endorsed by Paramount Pictures or CBS Studios.*
