const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/app/controllers/Portfolio.js','./src/app/controllers/Uploads.js','./src/app/controllers/Auth.js']

swaggerAutogen(outputFile, endpointsFiles)