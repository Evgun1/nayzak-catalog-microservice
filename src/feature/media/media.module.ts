import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
	imports: [PrismaModule, CloudinaryModule],
	controllers: [MediaController],
	providers: [MediaService],
	exports: [MediaService],
})
export class MediaModule {}
