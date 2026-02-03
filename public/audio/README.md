# Star Trek Audio Assets

This directory contains all audio assets for the Star Trek application.

## Directory Structure

```
audio/
├── themes/           # TV Show theme songs
├── movies/           # Movie soundtrack pieces
├── custom/           # Original compositions for The Horizon Chronicles
├── effects/          # Sound effects (phasers, transporters, etc.)
└── README.md
```

## Audio Files

### Custom Original Compositions (/custom/)

- `horizon_chronicles_theme.mp3` - Main theme for The Horizon Chronicles (5:00)
- `delta_awakening.mp3` - Shadow Coalition awakening theme (3:00)
- `nova_courage.mp3` - Captain Nova's heroic character theme (2:30)

### Theme Songs (/themes/)

- `tos_theme.mp3` - The Original Series theme
- `tng_theme.mp3` - The Next Generation theme
- `ds9_theme.mp3` - Deep Space Nine theme
- `voy_theme.mp3` - Voyager theme
- `ent_theme.mp3` - Enterprise "Faith of the Heart"
- `disc_theme.mp3` - Discovery theme
- `picard_theme.mp3` - Picard theme

### Movie Soundtracks (/movies/)

- `tmp_theme.mp3` - The Motion Picture theme
- `wok_battle.mp3` - Wrath of Khan battle music
- `undiscovered_theme.mp3` - The Undiscovered Country
- `first_contact.mp3` - First Contact theme
- `nemesis_theme.mp3` - Nemesis theme
- `kelvin_theme.mp3` - Kelvin Timeline theme

### Sound Effects (/effects/)

- `transporter.mp3` - Classic transporter sound
- `phaser.mp3` - Phaser firing sound
- `warp_engage.mp3` - Warp drive engagement
- `red_alert.mp3` - Red alert klaxon
- `bridge_ambience.mp3` - Bridge background sounds
- `computer_beeps.mp3` - Computer interface sounds
- `door_swoosh.mp3` - Sliding door sound
- `communicator.mp3` - Communicator chirp
- `ominous_tone.mp3` - Dark atmospheric sound
- `dark_whispers.mp3` - Shadow realm effects
- `dark_power.mp3` - Dark power surge
- `stellar_ambience.mp3` - Deep space ambient

## Implementation Notes

- All files are MP3 format for maximum browser compatibility
- Music files are 192kbps quality
- Sound effects are 128kbps quality
- Files are optimized for web delivery
- Fallback silence for missing files

## Usage in Application

The audio system automatically:

- Plays appropriate music for each prolog scene
- Triggers sound effects based on user actions
- Provides volume and mute controls
- Handles audio loading and playback errors gracefully

## Creating Audio Files

To add real audio files:

1. Place files in appropriate subdirectories
2. Use exact filenames as specified in the audio system
3. Ensure MP3 format and appropriate bitrates
4. Test playback in the application

For development, the system will work with placeholder files or gracefully handle missing audio.
