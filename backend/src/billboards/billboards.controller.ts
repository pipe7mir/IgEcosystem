import { Controller, Get, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billboard } from './billboard.entity';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';
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

  // Fallback upload endpoint (JWT protected) to avoid admin route mismatches in deployments
  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  async uploadImage(@Body() body: any) {
    try {
      const imageBase64 = body?.imageBase64 || body;

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        throw new HttpException('No valid image provided', HttpStatus.BAD_REQUEST);
      }

      if (process.env.CLOUDINARY_URL) {
        try {
          const result = await cloudinary.uploader.upload(imageBase64, {
            folder: 'oasis-billboards',
            resource_type: 'image',
          });
          return { success: true, imageUrl: result.secure_url };
        } catch (cloudErr: any) {
          console.error('⚠️ Cloudinary upload failed in /billboards/upload-image:', cloudErr.message);
        }
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `billboard-${Date.now()}.jpg`;
      const uploadsDir = path.join(process.cwd(), 'uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      const fullUrl = `${apiBaseUrl}/uploads/${filename}`;

      return { success: true, imageUrl: fullUrl };
    } catch (error: any) {
      console.error('❌ Error in /billboards/upload-image:', error);
      throw new HttpException(error.message || 'Upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Debug endpoint to test payload size limits
  @Post('test-payload')
  async testPayload(@Body() body: any) {
    try {
      const payloadSize = JSON.stringify(body).length;
      console.log(`✅ Payload received successfully: ${(payloadSize / 1024).toFixed(2)}KB`);
      
      if (body.imageBase64) {
        const base64Size = body.imageBase64.length;
        console.log(`📸 Base64 size: ${(base64Size / 1024).toFixed(2)}KB`);
      }
      
      return { 
        success: true, 
        message: 'Payload test passed',
        payloadSizeKB: (payloadSize / 1024).toFixed(2),
        base64SizeKB: body.imageBase64 ? (body.imageBase64.length / 1024).toFixed(2) : 'N/A'
      };
    } catch (error: any) {
      console.error('❌ Test payload error:', error.message);
      return { success: false, error: error.message };
    }
  }
}
