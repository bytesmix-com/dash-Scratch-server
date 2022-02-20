import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GUIModule } from './gui/gui.module';
import { PlaylistModule } from './playlist/playlist.module';
import { StudentModule } from './student/student.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    GUIModule,
    GraphQLModule.forRoot({
      playground: false,
      autoSchemaFile: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      introspection: true,
      autoTransformHttpErrors: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'https://api-local.stg-scratch-tutoring.app:3001',
          'https://stg-scratch-tutoring.app',
          'https://scratch-tutoring.app',
          'https://studio.apollographql.com',
          'https://local.stg-branch.be:8001',
          'https://local.stg-branch.be:8000',
          'https://local.stg-branch.be:8002',
          'https://scratch-tutoring-web-app.stg-branch.be',
          'https://scratch-tutoring-web-gui.stg-branch.be',
          'https://scratch-tutoring-web-admin.stg-branch.be',
          /\.stg-branch\.be:?d*$/,
        ],
        credentials: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: process.env.NODE_MODULE !== 'production',
        };
      },
    }),
    StudentModule,
    AuthModule,
    VideoModule,
    PlaylistModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
