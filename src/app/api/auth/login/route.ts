import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../lib/repositories/userRepository';
import { UserSessionRepository } from '../../../../lib/repositories/userSessionRepository';
import { LoginRequest, LoginResponse } from '@/types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required'
                },
                { status: 400 }
            );
        }

        // Initialize repositories
        const userRepository = new UserRepository();
        const sessionRepository = new UserSessionRepository();

        // Find user by email
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email or password'
                },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password + user.passwordSalt, user.hashedPassword);
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email or password'
                },
                { status: 401 }
            );
        }

        // Generate JWT session token with 3 hour expiry
        const jwtPayload = {
            userId: user.id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (3 * 60 * 60) // 3 hours
        };

        const sessionToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
            algorithm: 'HS256'
        });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 3);

        // Create session
        const session = await sessionRepository.create({
            userId: user.id,
            userSessionToken: sessionToken,
            expiresAt,
        });

        // Prepare response
        const response: LoginResponse = {
            success: true,
            message: 'Login successful',
            sessionToken: session.userSessionToken,
        };

        return NextResponse.json(response, { status: 200 });


    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
} 