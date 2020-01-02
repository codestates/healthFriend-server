module.exports = {
  apps: [
    {
      name: 'healthFriendServer',
      script: 'npm run prod',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
