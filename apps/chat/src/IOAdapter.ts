// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { Server } from 'socket.io';
// import * as sharedsession from 'express-socket.io-session';
// import { INestApplication } from '@nestjs/common';
// import { RequestHandler } from 'express';
// import { JwtService } from '@nestjs/jwt';

// export class IOAdapter extends IoAdapter {
//   constructor(private app: INestApplication, private session: RequestHandler) {
//     super(app);
//     this.app = app;
//   }

//   createIOServer(port: number, options?: any): any {
//     const server: Server = super.createIOServer(port, options);
//     const jwtService = this.app.get(JwtService);

//     // this.app.use(this.session);
//     server.use(
//       sharedsession(this.session, {
//         autoSave: true,
//       }),
//     );

//     server.use(async (socket, next) => {
//       const { access_token } = (socket.handshake as any).session;
//       try {
//         const user = await jwtService.verifyAsync(access_token);
//         socket.handshake.auth = user;
//         next();
//       } catch {
//         next(new Error('krasch'));
//       }
//     });
//     return server;
//   }
// }
