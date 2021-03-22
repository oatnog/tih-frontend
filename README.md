# TIH Vue Frontend
This project charts and animates change over time of tax return statuses. It uses Vue2, Chart.js, and axios.

If you aren't running your own local REST API server, you can set it to use another one with an environment variable.
For example, in the project root, create '.env.local'. Put something like this in there:

  VUE_APP_REST_API=https://restapi.example.com

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve (or vue ui)
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
