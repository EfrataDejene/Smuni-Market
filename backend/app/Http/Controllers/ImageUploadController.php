<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // Max 5MB
        ]);

        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET'); // Use unsigned preset for simplicity or signature
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName) {
            return response()->json(['error' => 'Cloudinary not configured in .env'], 500);
        }

        $file = $request->file('image');
        $timestamp = time();

        // Generate signature for secure upload
        $signature = sha1("timestamp={$timestamp}{$apiSecret}");

        $response = Http::attach(
            'file', file_get_contents($file->getRealPath()), $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
        ]);

        if ($response->successful()) {
            return response()->json([
                'url' => $response->json('secure_url'),
                'public_id' => $response->json('public_id'),
            ]);
        }

        return response()->json(['error' => 'Upload to Cloudinary failed', 'details' => $response->json()], 500);
    }
}
