import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pretty = configService.get<boolean>('logging.pretty', false);
        return {
          pinoHttp: {
            level: configService.get<string>('logging.level', 'info'),
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]',
                '*.password',
                '*.token',
                '*.refreshToken',
              ],
              censor: '[REDACTED]',
            },
            ...(pretty
              ? {
                  transport: {
                    target: 'pino-pretty',
                    options: { colorize: true, singleLine: true, translateTime: 'SYS:standard' },
                  },
                }
              : {}),
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
