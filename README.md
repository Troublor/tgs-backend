# Troublor General Purpose Server - Backend

This is the repository of the backend http server of the [Troublor General Purpose Server](https://troublor.xyz) (tgs). 

## Requirement

- node.js: `16.x`
- yarn

## Development

Install dependencies.
```bash
yarn 
```

Configure the server using `config.yaml` in the root directory, template using [config.example.yaml](./config.example.yaml).
```bash
cp config.example.yaml config.yaml
```

Start development server (with hot reloading).
```bash
yarn start:dev
```

## Deployment

The deployment is automated using [GitHub Action](.github/workflows/deploy.yml).

Simply merge to `release` branch would trigger the deployment.
The automation script will update pull the latest code at release branch on the server, rebuild the application and restart systemd service.

## License

This project is [MIT licensed](./LICENSE).
