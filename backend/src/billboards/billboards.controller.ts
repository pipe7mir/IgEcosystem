import { Controller, Get, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billboard } from './billboard.entity';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import * as path from 'path';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Public GET /billboards
@Controller('billboards')
export class BillboardsController {
  constructor(
    @InjectRepository(Billboard)
    private readonly repo: Repository<Billboard>,
  ) { }

  @Get()
  async index() {
    return this.repo.find({ where: { isActive: true }, order: { order: 'ASC', createdAt: 'DESC' } });
  }

  // Base64 image upload endpoint (JWT protected)
  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  async uploadImage(@Body() body: any) {
    try {
      console.log('📥 Billboard upload request received');

      // Handle both { imageBase64: "..." } and raw string
      let imageBase64 = body?.imageBase64 || body;

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        console.error('❌ No valid image provided in body');
        throw new HttpException('No valid image provided', HttpStatus.BAD_REQUEST);
      }

      console.log(`📸 Billboard image size: ${(imageBase64.length / 1024).toFixed(1)}KB`);

      // Try Cloudinary upload first if configured
      if (process.env.CLOUDINARY_URL) {
        try {
          console.log('☁️ Uploading billboard to Cloudinary...');
          const result = await cloudinary.uploader.upload(imageBase64, {
            folder: 'oasis-billboards',
            resource_type: 'image',
          });

          console.log(`✅ Cloudinary billboard upload success: ${result.secure_url}`);
          return { success: true, imageUrl: result.secure_url };
        } catch (cloudErr: any) {
          console.error('⚠️ Cloudinary billboard upload failed, using local fallback:', cloudErr.message);
          // Continue to local fallback
        }
      }

      // Local fallback: save to uploads folder
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `billboard-${Date.now()}.jpg`;
      const uploadsDir = path.join(process.cwd(), 'uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      const relativeUrl = `/uploads/${filename}`;
      console.log(`💾 Local billboard saved, returning relative path: ${relativeUrl}`);

      return { success: true, imageUrl: relativeUrl };
    } catch (error: any) {
      console.error('❌ Error in /billboards/upload-image:', error.message);
      throw new HttpException(
        error.message || 'Upload failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
