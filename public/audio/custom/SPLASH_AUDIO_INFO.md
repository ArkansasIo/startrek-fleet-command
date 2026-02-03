# Splash Screen Audio Files

## Required Audio Files

### splash-intro.mp3 / splash-intro.ogg

- **Duration**: 10-12 seconds
- **Style**: Epic orchestral arrangement inspired by Star Trek themes
- **Volume**: Moderate (will be set to 70% by default)
- **Purpose**: Cinematic intro music for the game engine splash screen

## Audio Features

- **Auto-play**: Attempts to play automatically (may be blocked by browser policies)
- **User Controls**:
  - Mute/unmute button in top-right corner
  - Skip button to bypass entire splash sequence
- **Fallback**: Silent operation if audio files are not available
- **Format Support**: MP3 and OGG formats for broad browser compatibility

## Implementation Notes

- Audio is integrated with the splash screen phases
- Plays during engine intro and team credits
- Automatically muted if user clicks mute button
- Gracefully handles autoplay restrictions
- No error thrown if audio files are missing

## Suggested Music Composition

1. **Opening (0-3s)**: Soft ambient tones building anticipation
2. **Engine Phase (3-6s)**: Rising orchestral elements, reminiscent of Star Trek TNG intro
3. **Credits Phase (6-10s)**: Full orchestral arrangement with bold brass
4. **Finale (10-12s)**: Triumphant conclusion leading to main title theme

## Audio Credits

When implementing actual audio:

- Consider licensing requirements for Star Trek-inspired music
- Credit original composers (Jerry Goldsmith, Alexander Courage, etc.)
- Ensure compliance with Paramount Pictures licensing
- Use royalty-free orchestral music if official themes cannot be licensed

## Technical Specifications

- **Format**: MP3 (primary), OGG (fallback)
- **Quality**: 128-192 kbps
- **Channels**: Stereo
- **Sample Rate**: 44.1 kHz
- **File Size**: Target <2MB for fast loading
