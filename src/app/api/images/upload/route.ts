import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadsDir = join(process.cwd(), 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = join(uploadsDir, fileName);
        await writeFile(filePath, buffer);
        return NextResponse.json({ path: `${fileName}` }, { status: 201 });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
} 