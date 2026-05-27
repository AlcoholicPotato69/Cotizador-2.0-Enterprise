import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

/**
 * Service handling core authentication business logic.
 * Validates credentials, integrates with the database via Prisma,
 * and issues JSON Web Tokens for authenticated sessions.
 *
 * @class AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Authenticates user credentials against the database.
   * Retrieves user roles, parses permissions, and generates a JWT containing tenant context.
   *
   * @param {LoginDto} credentials - Data transfer object containing user email and password.
   * @returns {Promise<{token: string, user: Record<string, any>}>} The signed JWT and detailed user payload.
   * @throws {UnauthorizedException} If credentials are invalid, missing, or user is not found.
   */
  async login(credentials: LoginDto) {
    try {
      const { email, password } = credentials;
      if (!email) {
        throw new UnauthorizedException('Email is required');
      }

      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        // For development/testing fallback if no real users exist in DB,
        // we reject arbitrary tenant injection.
        throw new UnauthorizedException('Invalid credentials');
      }

      // Validate password
      if (!password || !user.passwordHash) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Map permissions
      const permissions = new Set<string>();
      let primaryRole = 'USER';

      if (user.roles && user.roles.length > 0) {
        primaryRole = user.roles[0].role.name;
        user.roles.forEach((ur) => {
          ur.role.permissions.forEach((rp) => {
            permissions.add(rp.permission.name);
          });
        });
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: primaryRole,
        permissions: Array.from(permissions),
        tenantId: user.tenantId,
      };

      return {
        token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          tenant_id: user.tenantId,
          firstName: user.firstName,
          lastName: user.lastName,
          role: primaryRole,
          permissions: Array.from(permissions),
        },
      };
    } catch (e) {
      console.error('LOGIN ERROR:', e);
      throw e;
    }
  }
}
