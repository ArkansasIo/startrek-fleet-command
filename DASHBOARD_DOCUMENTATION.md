# Star Trek Fleet Command Dashboard - Complete Documentation

## Overview

The **EnhancedStarTrekDashboard** is the central hub of the Star Trek Fleet Command game, providing access to 50+ distinct game systems organized into logical categories. The dashboard uses a hierarchical navigation structure with primary sections and secondary submenus for detailed management of game operations.

**Key Statistics:**
- **50+ Major Systems** - Fleet management, combat, exploration, and more
- **Two-Tier Navigation** - Primary sections with optional submenu categories
- **Responsive Design** - Adapts to different screen sizes with collapsible navigation
- **Breadcrumb Navigation** - Shows current location in the hierarchy
- **Dynamic Titling System** - Context-aware page titles showing selected section and submenu

---

## Dashboard Architecture

### Component Structure

```
EnhancedStarTrekDashboard (Main Container)
├── EnhancedStarTrekNav (Navigation Sidebar)
├── Breadcrumb Navigation (Current Location)
├── Live Stats Section (Player Status)
└── Content Area (Rendered Component)
    └── Dynamic Section Component (50+ options)
```

### State Management

The dashboard uses React hooks for state management:

```typescript
const [activeSection, setActiveSection] = useState("fleet");        // Currently selected section
const [activeSubmenu, setActiveSubmenu] = useState<string>();      // Currently selected submenu
const { player } = useGameContext();                                 // Current player data
const [messages, setMessages] = useState([]);                        // PM system messages
```

**Navigation Handler:**
```typescript
const handleSectionChange = (section: string, submenu?: string) => {
  setActiveSection(section);
  setActiveSubmenu(submenu);
};
```

---

## Complete System Listing

### FLEET OPERATIONS (6 Systems)

**Fleet Command** (`fleet`)
- Overview: Fleet composition and status
- Deployment Orders: Assign fleet deployment
- Fleet Logistics: Resource management
- Command Personnel: Officer assignments

**Starship Database** (`starships`)
- Active Fleet: Ships in service
- Under Construction: Ships being built
- Ship Classes: Available starship classes
- Decommissioned: Retired ships archive

**Fleet Tactical** (`fleet_tactical`)
- Fleet Formations: Tactical positioning
- Strategic Planning: Battle strategies
- Tactical Intelligence: Enemy analysis

**Shipyard Operations** (`shipyard`)
- Construction Bays: Build new ships
- Refit Operations: Upgrade existing ships
- Ship Design: Create custom designs
- Resource Management: Materials tracking

### NAVIGATION & EXPLORATION (3 Systems)

**Navigation Systems** (`navigation`)
- Current Position: Fleet location tracking
- Course Plotting: Set travel destinations
- Navigation Hazards: Spatial anomalies

**Universal Cartography** (`universe_maps`)
- Alpha Quadrant: Map and data
- Beta Quadrant: Map and data
- Gamma Quadrant: Map and data
- Delta Quadrant: Map and data

**Stellar Cartography** (`stellar_cartography`)
- Star chart mapping and analysis

### SHIP SYSTEMS (5 Systems)

**Ship Systems** (`systems`)
- Power Systems: Warp core and reactor management
- Life Support: Environmental control
- Propulsion: Engine operations
- System Diagnostics: Status monitoring

**Engineering Systems** (`engineering`)
- Warp Core: Reactor management
- Maintenance: Routine maintenance scheduling
- Jefferies Tubes: Engineering pathways
- Environmental: Life support systems

**Sensors** (`sensors`)
- Long Range Sensors: 65,536+ light-year range
- Short Range Sensors: Tactical range
- Internal Sensors: Crew location tracking
- Specialized Arrays: Science sensors

### COMBAT OPERATIONS (4 Systems)

**Combat Operations** (`combat`)
- Weapons Control: Phaser and torpedo management
- Shield Management: Deflector shield control
- Combat Tactics: Battle strategies
- Damage Control: System repair and recovery

**Weapons Systems** (`weapons`)
- Phaser Arrays: Beam weapon operations
- Torpedo Launchers: Projectile weapons
- Targeting Systems: Target acquisition
- Weapons Inventory: Ammunition tracking

**Tactical Systems** (`tactical`)
- Threat Analysis: Enemy assessment
- Security Protocols: Defense procedures
- Intelligence Reports: Tactical data

**Planetary Combat Operations** (`planetary_combat`) ⭐ NEW
- Mission Tracking: Active planetary operations (6 mission types)
- Defense Management: 5 defense system types with tactical specs
- Success Rate Calculations: Mission probability analysis
- Resource Outcomes: Mission reward determination

### CREW MANAGEMENT (5 Systems)

**Crew Management** (`crew`)
- Crew Roster: Personnel database
- Duty Assignments: Shift scheduling
- Medical Records: Health monitoring
- Performance Reviews: Evaluations

**Character Creation** (`character_creation`)
- Basic Info: Name and identity
- Attributes: Core character stats
- Skills: Training and expertise
- Background: Character history
- Traits: Special abilities
- Character Roster: Multiple characters

**Talent Trees** (`talent_trees`)
- Skill progression and ability unlocking

**Leveling & Crafting** (`leveling_crafting`)
- Character Levels: Experience progression
- Crafting Disciplines: Crafting skills
- Tempering System: Item enhancement
- Masterwork Crafting: Advanced crafting
- Building Construction: Base building
- Progress Tracking: Character advancement

### OPERATIONS & MISSIONS (5 Systems)

**Mission Operations** (`missions`)
- Active Missions: In-progress operations
- Mission History: Completed missions
- Classified Operations: Secret missions

**Enhanced Mission System**
- Advanced mission tracking and management

**Story Missions** (`story_missions`)
- Campaign progression

**Season Operations** (`season_operations`)
- Time-limited events and content

**Universe Events** (`universe_events`)
- Active Events: Current global events
- Event Bosses: Special encounters
- Event Categories: Event types
- Participation History: Player participation record
- Event Rewards: Earning opportunities
- Event Schedule: Upcoming events

### SCIENCE & RESEARCH (4 Systems)

**Science Division** (`science`)
- Active Research: Current projects
- Stellar Astronomy: Star analysis
- Xenobiology: Alien life studies
- Theoretical Physics: Physics research

**Research & Development** (`research_development`)
- New technology development

**Technology Research Center** (`technology_research`) ⭐ NEW
- 91+ Technologies across 5 tiers and 10 categories
- Technology progression with prerequisites
- Research costs and duration calculations
- Technology synergies and upgrade paths
- Advanced filtering by category and tier

**Temporal Mechanics** (`temporal_mechanics`)
- Time-related game mechanics

### EXPLORATION & DISCOVERY (3 Systems)

**Exploration Division** (`exploration`)
- Planetary Surveys: Survey discoveries
- Recent Discoveries: New findings
- Star Charts: Cartography data

**Planetary Explorer** (`planetary`)
- Federation Worlds: Aligned planets
- Neutral Zone: Disputed territory
- Unexplored Regions: Undiscovered areas
- Colonies: Player settlements

**Planetary Catalog** (`planetary_catalog`)
- A-Z Catalog: Complete planet database
- Advanced Search: Filtered searching
- Classifications: Planet types
- Strategic Analysis: Tactical assessment

### GALACTIC SYSTEMS (2 Systems)

**Galactic Territories** (`galactic_territories`)
- Territory Overview: Territorial control
- Quadrants: Major regions
- Sectors: Subsections
- Star Systems: Individual systems
- Facilities: Bases and outposts
- Phenomena: Space anomalies

**Space Phenomena** (`space_phenomena`)
- Anomaly tracking and analysis

### SPECIAL SYSTEMS (7 Systems)

**Universe Travel System** (`universe_travel`) ⭐ NEW
- Real interstellar travel calculator with TNG warp mechanics
- Location-based route planning with 10+ known locations
- Distance calculations in multiple units (light-years, km, parsecs)
- Travel time with warp stress assessment
- Fuel requirements with efficiency metrics
- Route safety analysis and crew considerations
- Hazard detection and navigation warnings

**Red Alert Status** (`red_alert`)
- Emergency status indicator

**Communications** (`communications`)
- Subspace Communications: Long-range transmissions
- Internal Communications: Ship-wide messaging
- Universal Translator: Language translation
- Emergency Channels: Distress signals

**Transporter & Replicator** (`transporter`)
- Personnel Transport: Crew movement
- Cargo Transport: Item movement
- Replicator Systems: Item duplication
- Pattern Buffer: Temporary storage

**Holodeck Facilities** (`holodeck`)
- Holographic Programs: Available programs
- Training Simulations: Crew training
- Recreation Programs: Entertainment
- Emergency Medical: EMH hologram

**Service Record** (`achievements`)
- Award tracking and display

**Red Alert System**
- Critical status alerts

### DIPLOMACY & RELATIONS (2 Systems)

**Diplomatic Corps** (`diplomatic`)
- Diplomatic Relations: Relations status
- Active Negotiations: Treaty discussions
- Diplomatic Protocols: Communication procedures
- First Contact: New species interactions

**Guild Management** (`guild_management`)
- Manage guild operations
- Guild Applications: Recruit management
- Guild Events: Organize activities
- Guild Alliances: Multi-guild coordination
- Browse Guilds: Find other guilds

### UTILITIES & SETTINGS (5 Systems)

**Threat Assessment** (`threat_assessment`)
- Enemy threat evaluation

**Cargo Bay Operations** (`cargo_bay`)
- Bay Overview: Storage status
- Container Management: Organize cargo
- Cargo Manifest: Item tracking
- Operations: Loading/unloading
- Analytics: Usage statistics

**Shuttle Bay Operations** (`shuttle_bay`)
- Bay Overview: Shuttle status
- Shuttle Fleet: Available shuttles
- Flight Operations: Launch management
- Maintenance: Shuttle repairs
- Analytics: Flight statistics

**System Settings** (`system_settings`)
- Game configuration

**Audio Library** (`audio_menu`)
- Game music and sound settings

**Game Modes** (`game_modes`)
- Different game modes and rules

**Storyline System** (`storyline_system`)
- Campaign and narrative progression

**PM Systems Inbox** (`pm_systems`)
- Player-to-player messaging system

---

## New Enhanced Systems (Phase 4)

### 1. Universe Travel System (`universe_travel`)

**Purpose:** Real-time interstellar travel calculator based on TNG warp mechanics

**Key Features:**
- **10+ Known Locations** - Federation worlds, neutral planets, deep space
- **TNG Warp Scale** - Mathematically accurate velocity calculations (v = w^(10/3) × c)
- **Multi-Unit Distance Display** - Light-years, kilometers, parsecs, star sectors
- **Travel Time Calculator** - Days/hours/minutes with warp stress assessment
- **Fuel Requirements** - Power output and efficiency calculations
- **Route Safety Analysis** - Anomaly detection and crew endurance evaluation
- **Hazard Assessment** - Specific dangers on chosen route
- **Crew Considerations** - Morale impact, rest stops, medical supplies

**Navigation Flow:**
1. Select Origin Location (with coordinates, sector, quadrant)
2. Select Destination Location
3. Choose Warp Factor (1-10)
4. System calculates and displays:
   - Distance in 4 units
   - Travel time with stress metrics
   - Fuel requirements with efficiency %
   - Route safety assessment
   - Crew impact warnings
   - Waypoint recommendations

**Data Structure:**
```typescript
interface KnownLocation {
  name: string;
  coordinates: [number, number, number];
  quadrant: string;
  sector: string;
  description: string;
  distance_from_earth?: number;
}

interface TravelRoute {
  origin: KnownLocation;
  destination: KnownLocation;
  directDistance: number;  // light-years
  travelTime: TimeObj;
  fuelRequired: number;
  warpFactor: number;
}
```

---

### 2. Technology Research Center (`technology_research`)

**Purpose:** Research and development hub for 91+ technologies

**Key Features:**
- **91+ Technologies** - Across 5 tiers (T1-T5) and 10 categories
- **Tier System** - Progressive unlock with prerequisites
- **Category Filtering** - 10 filter categories for quick browsing
- **Tech Rarity** - Common, Uncommon, Rare, Epic, Legendary
- **Research Progression** - Track research queue and completed technologies
- **Detailed Tech Info:**
  - Tier classification
  - Rarity rating
  - Max level (1-10)
  - Research time requirements
  - Cost per level with scaling multiplier (1.5-2.0x)
  - Game effect descriptions with type breakdown
  - Prerequisites list with completion status
  - Technology synergies (up to 5 related techs)

**Research Flow:**
1. Browse technologies by category or tier
2. Select technology to view details
3. View requirements (prerequisites, costs, time)
4. Check synergies and related techs
5. Start research when prerequisites met
6. Track progress in research queue
7. Complete and unlock new capabilities

**Key Mechanics:**
- **Prerequisites Chain** - Some techs require others
- **Synergy Bonuses** - Techs work better together
- **Cost Scaling** - Each level costs more to research
- **Category Progression** - Some categories unlock from tier advancement

---

### 3. Planetary Combat Operations (`planetary_combat`)

**Purpose:** Ground-based combat and planetary defense management

**Key Features:**
- **6 Mission Types:**
  - Raid (Quick strikes for resources)
  - Attack (Military assault)
  - Spy (Intelligence gathering)
  - Sabotage (Destroy targets)
  - Espionage (Deep cover operations)
  - Siege (Extended assaults)

- **Mission Details:**
  - Mission type classification
  - Target location and details
  - Fleet assignment
  - Success rate calculation (30-95%)
  - ETA countdown
  - Resource outcomes (credits, minerals, tech points)
  - Completion status and time remaining

- **5 Defense System Types:**
  - **Cannon** (High damage, medium range)
  - **Laser** (Rapid fire, close range)
  - **Missile** (Area effect, long range)
  - **Shield** (Damage reduction)
  - **Detector** (Enemy location)

- **Defense System Specs:**
  - Type-specific stats (range, fire rate)
  - Level and strength rating
  - Durability percentage
  - Status condition (Operational/Damaged/Critical)
  - Upgrade costs and repair costs
  - Total defense rating calculation

- **Defense Summary Dashboard:**
  - Total defense rating (sum of active systems)
  - Number of operational systems
  - Overall health percentage (average durability)
  - System status indicators

**Tactical Flow:**
1. Review active missions with success rates
2. Deploy fleets to launch new missions
3. Monitor mission progress and ETA
4. View defense system status
5. Upgrade high-value systems
6. Repair damaged systems
7. Adjust defense strategy based on threat level

---

## UI/UX Patterns

### Navigation
- **Sidebar Menu** - Category-based organization
- **Breadcrumb Trail** - Shows current location
- **Section Titles** - Dynamic based on selection
- **Submenu Items** - Category-specific options

### Content Display
- **Card Layouts** - Organized information groups
- **Tabs** - Multiple views of same data
- **Progress Bars** - Visual representation of metrics
- **Badges** - Status and category indicators
- **Grids** - Multi-item displays
- **Scroll Areas** - Long lists

### Interactive Elements
- **Buttons** - Call-to-action items
- **Dropdowns** - Category and filter selection
- **Input Fields** - Parameter entry
- **Sliders** - Continuous value adjustment

---

## Component Integration

### Props Pattern
All components receive the `activeSubmenu` prop:
```typescript
const commonProps = { activeSubmenu };
return <ComponentName {...commonProps} />;
```

This allows components to:
- Render different content based on selected submenu
- Maintain context across user navigation
- Preserve sub-state independently

### Message System
The PM Systems component has direct state management:
```typescript
case "pm_systems":
  return <InboxPMSystem 
    playerId={player.id} 
    messages={messages} 
    onSend={msg => setMessages(prev => [...prev, msg])} 
  />;
```

---

## Developer Notes

### Adding New Systems

To add a new system to the dashboard:

1. **Create Component**
   ```typescript
   export function NewSystemComponent({ activeSubmenu }) {
     return <div>{/* System content */}</div>;
   }
   ```

2. **Import in Dashboard**
   ```typescript
   import { NewSystemComponent } from "./sections/NewSystem";
   ```

3. **Add Section Title**
   ```typescript
   new_system: "New System Title"
   ```

4. **Add Submenu Titles (if needed)**
   ```typescript
   new_system: {
     submenu_1: "Submenu Title",
     submenu_2: "Another Submenu"
   }
   ```

5. **Add Case in renderSection**
   ```typescript
   case "new_system":
     return <NewSystemComponent {...commonProps} />;
   ```

6. **Add Navigation Entry** (in EnhancedStarTrekNav.tsx)
   ```typescript
   { id: "new_system", label: "New System", category: "systems" }
   ```

### Performance Considerations

- Each section component is rendered on-demand
- Only one component renders at a time
- Use React.memo for components with expensive renders
- Implement lazy loading for large data sets
- Use useCallback for event handlers to prevent re-renders

---

## Statistics Summary

- **Total Systems:** 50+
- **Categories:** Fleet, Exploration, Engineering, Combat, Crew, Science, Diplomacy, Special, Utilities
- **Navigation Items:** 50+ unique sections
- **Submenu Options:** 100+ total (varying by section)
- **New Enhanced Systems:** 3 (Universe Travel, Technology Research, Planetary Combat)
- **Technologies Available:** 91+
- **Known Locations:** 10+
- **Mission Types:** 6
- **Defense System Types:** 5
- **Responsive Breakpoints:** 3 (mobile, tablet, desktop)

---

## Future Expansion Areas

1. **Alliance/PvP Systems** - Player-vs-player interactions
2. **Economy Systems** - Trading and commerce
3. **Procedural Generation** - Random content creation
4. **Seasonal Content** - Time-limited events and rewards
5. **Cross-System Integration** - Data sharing between systems
6. **Advanced Analytics** - Statistical breakdowns
7. **Custom Dashboards** - Player-defined layout
8. **Real-time Multiplayer** - Shared fleet operations
9. **Mobile Companion App** - Remote access
10. **Voice Controls** - Hands-free operation (enterprise bridge theme)

---

## Conclusion

The **EnhancedStarTrekDashboard** provides a comprehensive, immersive interface to the entire Star Trek Fleet Command game. With over 50 interconnected systems, detailed navigation, and three newly enhanced features for exploration, research, and combat, players have complete control over their fleet operations, character development, and strategic decisions in the Star Trek universe.

The modular architecture ensures easy expansion and maintenance, while the responsive design guarantees accessibility across all device types. Whether managing fleet operations, researching advanced technologies, or commanding planetary combat, players have all necessary information and tools at their fingertips.
