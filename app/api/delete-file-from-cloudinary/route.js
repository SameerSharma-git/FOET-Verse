import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {

  try {
    const body = await request.json();
    const { public_id } = body;

    if (!public_id) {
      return NextResponse.json({ 
        message: 'Missing public_id in request body.' 
      }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
        resource_type: 'image'
    });


    if (result.result === 'ok') {
      return NextResponse.json({ 
        message: `Image with public ID ${public_id} deleted successfully.`,
        status: result.result
      }, { status: 200 });
    } 
    
    // Cloudinary returns 'not found' if the public_id doesn't exist
    if (result.result === 'not found') {
        // You might still treat this as a success for cleanup purposes
        return NextResponse.json({
            message: `Image not found on Cloudinary (ID: ${public_id}). Continuing.`,
            status: result.result
        }, { status: 200 });
    }

    // Handle other Cloudinary deletion failures
    return NextResponse.json({ 
        message: 'Cloudinary deletion failed.', 
        details: result 
    }, { status: 500 });

  } catch (error) {
    console.error('API Route Error during Cloudinary deletion:', error);
    return NextResponse.json({ 
      message: 'An internal server error occurred during deletion.',
      error: error.message
    }, { status: 500 });
  }
}