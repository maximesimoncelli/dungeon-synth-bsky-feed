module.exports = {
  apps: [
    {
      name: 'Bluesky Dungeon Synth Feed',
      script: './index.js',
      watch: true,
      ignore_watch: ['node_modules', 'db.sqlite-journal'],
    },
  ],
}
