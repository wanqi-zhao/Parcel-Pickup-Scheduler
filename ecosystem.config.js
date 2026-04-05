module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
    },
    {
      name: 'frontend',
      script: 'bash',
      args: '-c "serve -s build -l 3000"',
      cwd: './frontend',
    },
  ],
};
