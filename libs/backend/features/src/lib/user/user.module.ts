// libs/backend/features/src/lib/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import UserRepository from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { UserRelationshipService } from '../user-relationship/user-relationship.service';
import { Neo4jModule } from '@vinylplatz/backend/neo4j';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule, // Add ConfigModule to imports
    Neo4jModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy, UserRelationshipService],
  exports: [UserService],
})
export class UserModule {}