import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { publicId } = body;
        console.log(publicId);
        if (!publicId) {
            return new NextResponse("Invalid data", {
                status: 400,
            });
        }

        await cloudinary.uploader.destroy(publicId);
        return NextResponse.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        return new NextResponse("Internal Error", {
            status: 500,
        });
    }
}
