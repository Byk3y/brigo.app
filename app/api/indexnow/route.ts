import { NextRequest, NextResponse } from 'next/server';
import { submitToIndexNow } from '@/lib/indexnow';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { urls } = body;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request. "urls" array is required.' },
                { status: 400 }
            );
        }

        // Verify authentication here if needed. 
        // For now, we'll assume this is protected by existing middleware or admin checks elsewhere 
        // or add a simple secret check if exposed publicly.
        // Ideally, this route should be behind an admin guard.

        const result = await submitToIndexNow(urls);

        if (result.success) {
            return NextResponse.json({ message: 'URLs submitted to IndexNow', details: result });
        } else {
            return NextResponse.json(
                { error: 'Failed to submit URLs', details: result },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
