// Script to generate silent MP3 placeholder files for development
// This ensures the audio system doesn't error on missing files

const fs = require("fs");
const path = require("path");

// Create a simple silent MP3 header (minimal valid MP3)
const silentMp3Header = Buffer.from([
  0xff,
  0xfb,
  0x90,
  0x00, // MP3 header
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00, // Silent frame
]);

const audioFiles = [
  // Custom compositions
  "custom/horizon_chronicles_theme.mp3",
  "custom/delta_awakening.mp3",
  "custom/nova_courage.mp3",

  // TV Themes
  "themes/tos_theme.mp3",
  "themes/tng_theme.mp3",
  "themes/ds9_theme.mp3",
  "themes/voy_theme.mp3",
  "themes/ent_theme.mp3",
  "themes/disc_theme.mp3",
  "themes/picard_theme.mp3",

  // Movie soundtracks
  "movies/tmp_theme.mp3",
  "movies/wok_battle.mp3",
  "movies/undiscovered_theme.mp3",
  "movies/first_contact.mp3",
  "movies/nemesis_theme.mp3",
  "movies/kelvin_theme.mp3",

  // Sound effects
  "effects/transporter.mp3",
  "effects/phaser.mp3",
  "effects/warp_engage.mp3",
  "effects/red_alert.mp3",
  "effects/bridge_ambience.mp3",
  "effects/computer_beeps.mp3",
  "effects/door_swoosh.mp3",
  "effects/communicator.mp3",
  "effects/ominous_tone.mp3",
  "effects/dark_whispers.mp3",
  "effects/dark_power.mp3",
  "effects/stellar_ambience.mp3",
];

// Create placeholder files
audioFiles.forEach((filePath) => {
  const fullPath = path.join("public/audio", filePath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create silent MP3 file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, silentMp3Header);
    console.log(`Created placeholder: ${filePath}`);
  }
});

console.log("Audio placeholder generation complete!");
