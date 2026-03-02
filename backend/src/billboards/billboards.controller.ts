import { Controller, Get, Post, Body, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
  ) {}

  @Get()
  async index() {
    return this.repo.find({ where: { isActive: true }, order: { order: 'ASC', createdAt: 'DESC' } });
  }

  // Multipart file upload endpoint (JWT protected)
  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadsDir = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `billboard-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new HttpException('Only JPEG, PNG, and WebP images are allowed', HttpStatus.BAD_REQUEST), false);
        }
      },
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }

      console.log(`📤 Processing file: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      // Try Cloudinary upload first
      if (process.env.CLOUDINARY_URL) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'oasis-billboards',
            resource_type: 'image',
          });
          
          // Delete local file after successful Cloudinary upload
          fs.unlinkSync(file.path);
          console.log(`☁️ Uploaded to Cloudinary: ${result.secure_url}`);
          
          return { success: true, imageUrl: result.secure_url };
        } catch (cloudErr: any) {
          console.error('⚠️ Cloudinary upload failed, using local fallback:', cloudErr.message);
          // Continue to local fallback
        }
      }

      // Local fallback
      const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      const fullUrl = `${apiBaseUrl}/uploads/${file.filename}`;
      console.log(`💾 Saved locally: ${fullUrl}`);

      return { success: true, imageUrl: fullUrl };
    } catch (error: any) {
      // Clean up file if error occurs
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      console.error('❌ Error in /billboards/upload-image:', error.message);
      throw new HttpException(
        error.message || 'Upload failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }}
