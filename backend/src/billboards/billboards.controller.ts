import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billboard } from './billboard.entity';

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
