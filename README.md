[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Sample project for Senior NodeJS Developer Position at DevStudio by Muneeb
This is a [Moleculer](https://moleculer.services/)-based microservices project.

First Microservice [Products Service] have two endpoints:
- Get Available Products
- Buy a Product

Second Microservice [Warehouse Service] have two endpoints:
- Get Product count against a given Product Id
- Update Product count on Product buy

Backend DB:
- Mongo DB Docker with some seeded data

## Usage
Start the project with `npm run dc:up` command.
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **products**: Sample DB service with `availableProducts` and `buyProduct` actions.
- **products**: Sample DB service with `productCount` and `decreaseQuantity` actions.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script{{#lint}}
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
