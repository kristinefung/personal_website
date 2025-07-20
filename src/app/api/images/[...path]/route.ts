import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        // Await params for Next.js 15 compatibility
        const { path } = await params;

        // Join the path segments
        const imagePath = path.join('/');

        // Define the directory where images are stored (outside public folder)
        // You can change this to your preferred directory
        const uploadsDir = join(process.cwd(), 'uploads');
        const fullPath = join(uploadsDir, imagePath);

        // Security check: make sure the path is within the uploads directory
        if (!fullPath.startsWith(uploadsDir)) {
            return NextResponse.json(
                { error: 'Invalid file path' },
                { status: 400 }
            );
        }

        // Check if file exists
        if (!existsSync(fullPath)) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        // Read the file
        const imageBuffer = await readFile(fullPath);

        // Determine content type based on file extension
        const ext = imagePath.toLowerCase().split('.').pop();
        let contentType = 'image/jpeg'; // default

        switch (ext) {
            case 'png':
                contentType = 'image/png';
                break;
            case 'gif':
                contentType = 'image/gif';
                break;
            case 'webp':
                contentType = 'image/webp';
                break;
            case 'svg':
                contentType = 'image/svg+xml';
                break;
        }

        // Return the image with appropriate headers
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error('Error serving image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 