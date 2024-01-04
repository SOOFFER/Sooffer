const config = require('../config');

const appMode = config.appMode;
const winston = require('winston');

let logger;

logger = console;

// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });

export default logger;
