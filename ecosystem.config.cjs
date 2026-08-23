module.exports = {
  apps: [
    {
      name: 'osoul-v3',
      script: 'npx',
      args: 'next start -H 0.0.0.0 -p 3000',
      cwd: __dirname,
      env: { NODE_ENV: 'production', PORT: 3000 },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
