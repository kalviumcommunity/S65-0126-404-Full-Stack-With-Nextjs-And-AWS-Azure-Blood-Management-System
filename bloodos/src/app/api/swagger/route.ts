import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';

/**
 * Endpoint structurally rendering the full `swagger.json` mapping. 
 * Allows users physically importing to Postman simply by fetching `/api/swagger`.
 */
export async function GET() {
    const spec = await getApiDocs();
    return NextResponse.json(spec);
}
