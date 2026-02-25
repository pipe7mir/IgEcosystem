import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Announcement } from './announcements/announcement.entity';
import { RequestEntity } from './requests/request.entity';
import { Setting } from './settings-module/setting.entity';
import { BoardMember } from './management/board-member.entity';
import { GalleryItem } from './management/gallery-item.entity';
import { ResourceEntity } from './resources-module/resource.entity';
import { Billboard } from './billboards/billboard.entity';
import { EventForm } from './event-forms-module/event-form.entity';
import { FormSubmission } from './event-forms-module/form-submission.entity';
import { LiveSetting } from './live/live-setting.entity';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
          User,
          Announcement,
          RequestEntity,
          Setting,
          BoardMember,
          GalleryItem,
          ResourceEntity,
          Billboard,
          EventForm,
          FormSubmission,
          LiveSetting,
        ],
        synchronize: false, // Maintain sync manually with Laravel schema
      }),
    }),
    AuthModule,
    UsersModule,
    AnnouncementsModule,
    WhatsappModule,
    RequestsModule,
    ManagementModule,
    ResourcesModule,
    BillboardsModule,
    EventFormsModule,
    LiveModule,
    SettingsModule,
    EmailModule,
  ],
  controllers: [TestCorsController],
})
export class AppModule { }
