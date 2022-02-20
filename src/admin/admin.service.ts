import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';
import * as crypto from 'crypto';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async adminById(id: number) {
    return await this.adminRepository.findOne(id);
  }

  async verifyAdmin(loginId: string, password: string) {
    return await this.adminRepository.findOne({
      loginId,
      password,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const currentHashedRefreshToken = await crypto
      .createHash('sha512')
      .update(refreshToken)
      .digest('base64');
    await this.adminRepository.update(id, { currentHashedRefreshToken });
  }

  async getAdminIfRefreshTokenMatches(refreshToken: string, adminId: number) {
    const user = await this.adminById(adminId);

    const isRefreshTokenMatching =
      crypto.createHash('sha512').update(refreshToken).digest('base64') ===
      user.currentHashedRefreshToken;

    if (isRefreshTokenMatching) {
      return user;
    } else {
      throw new PreconditionFailedException('Refresh token does not match');
    }
  }
}
