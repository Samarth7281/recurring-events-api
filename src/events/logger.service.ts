import { Injectable } from "@nestjs/common";
import { Logger } from "winston";
import * as winston from 'winston'
import { winstonConfig } from "winston.config";

@Injectable()
export class LoggerService{
    private readonly logger: Logger

    constructor(){
        this.logger = winston.createLogger(winstonConfig)
    }

    log(message: string){
        this.logger.log({level: 'info',message})
    }

    error(message: string){
        this.logger.error({level: 'error',message})
    }
    
    warn(message: string){
        this.logger.warn({level: 'warn',message})
    }

    info(message: string){
        this.logger.info({level: 'info',message})
    }
    
}