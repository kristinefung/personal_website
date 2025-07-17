import { NextRequest, NextResponse } from 'next/server';
import { EnquiryRepository } from '@/lib/repositories/enquiryRepository';

const enquiryRepository = new EnquiryRepository();

// export async function GET(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const id = parseInt(params.id);

//         if (isNaN(id)) {
//             return NextResponse.json(
//                 { error: 'Invalid enquiry ID' },
//                 { status: 400 }
//             );
//         }

//         const enquiry = await enquiryRepository.findById(id);

//         if (!enquiry) {
//             return NextResponse.json(
//                 { error: 'Enquiry not found' },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(enquiry);
//     } catch (error) {
//         console.error('Error fetching enquiry:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }

// export async function PUT(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const id = parseInt(params.id);

//         if (isNaN(id)) {
//             return NextResponse.json(
//                 { error: 'Invalid enquiry ID' },
//                 { status: 400 }
//             );
//         }

//         const body = await request.json();

//         // Validate email format if provided
//         if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
//             return NextResponse.json(
//                 { error: 'Please provide a valid email address' },
//                 { status: 400 }
//             );
//         }

//         const updateData = {
//             ...(body.name && { name: body.name.trim() }),
//             ...(body.email !== undefined && { email: body.email?.trim() || undefined }),
//             ...(body.phone !== undefined && { phone: body.phone?.trim() || undefined }),
//             ...(body.subject && { subject: body.subject.trim() }),
//             ...(body.message && { message: body.message.trim() }),
//         };

//         const enquiry = await enquiryRepository.update(id, updateData);

//         return NextResponse.json({
//             message: 'Enquiry updated successfully',
//             enquiry,
//         });
//     } catch (error) {
//         console.error('Error updating enquiry:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const id = parseInt(params.id);

//         if (isNaN(id)) {
//             return NextResponse.json(
//                 { error: 'Invalid enquiry ID' },
//                 { status: 400 }
//             );
//         }

//         const { searchParams } = new URL(request.url);
//         const hard = searchParams.get('hard') === 'true';

//         if (hard) {
//             await enquiryRepository.hardDelete(id);
//         } else {
//             await enquiryRepository.delete(id);
//         }

//         return NextResponse.json({
//             message: `Enquiry ${hard ? 'permanently deleted' : 'deleted'} successfully`,
//         });
//     } catch (error) {
//         console.error('Error deleting enquiry:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// } 