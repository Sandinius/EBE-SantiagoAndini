import winston from "winston";

const devlogger = winston.createLogger({
    transports:[
        new winston.transports.Console({level:"debug"}),
        new winston.transports.Console({level:"http"}),
        new winston.transports.Console({level:"info"}),
        new winston.transports.Console({level:"warning"}),
        new winston.transports.Console({level:"error"}),
        new winston.transports.Console({level:"fatal"}),

    ]
})
const prodlogger = winston.createLogger({
    transports:[
        new winston.transports.Console({level:"info"}),
        new winston.transports.Console({level:"warning"}),
        new winston.transports.Console({level:"error"}),
        new winston.transports.File({filename:"./errors.log",level:"error"}),
        new winston.transports.Console({level:"fatal"}),

    ]
})
export const addlogger =(req,res,next) =>{
    switch (process.env.NODE_ENV) {
        case 'development':
            req.logger = devlogger
            break;
        
        case 'production':
            req.logger = prodlogger
            break;
        
        
        default:
            throw new Error('Enviroment doesnt exist')
    }

    // req.logger = process.env.NODE_ENV === 'development' ? devlogger:prodlogger;
    // req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`)
    next();
}