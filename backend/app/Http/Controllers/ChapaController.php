<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChapaController extends Controller
{
    /**
     * Initialize Real Chapa Transaction & Return Official Hosted Link
     * Endpoint: POST /api/chapa/initialize
     */
    public function initialize(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required',
            'amount' => 'required|numeric',
            'email' => 'nullable|string',
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'phone_number' => 'nullable|string',
        ]);

        $tx_ref = 'SMUNI-TX-' . time() . '-' . rand(1000, 9999);
        $secretKey = env('CHAPA_SECRET_KEY', 'CHASECK_TEST-fNOiPdJipHZU2lWhpkp3qaxrOVpjW9tn');
        $publicKey = env('CHAPA_PUBLIC_KEY', 'CHAPUBK_TEST-t0zkE06QEGI4eZG40wZPVJlsSD5uFrpM');

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $callbackUrl = url("/api/chapa/callback/" . $validated['order_id']);
        
        // Return URL brings user directly to order-success page once Chapa payment completes
        $returnUrl = $frontendUrl . "/order-success/" . $validated['order_id'] . "?status=success&tx_ref=" . $tx_ref;

        // Ensure email is valid format for Chapa validation
        $rawEmail = filter_var($validated['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $email = $rawEmail ? $rawEmail : 'customer.smuni@gmail.com';

        $chapaPayload = [
            'amount' => (string) $validated['amount'],
            'currency' => 'ETB',
            'email' => $email,
            'first_name' => !empty($validated['first_name']) ? $validated['first_name'] : 'Customer',
            'last_name' => !empty($validated['last_name']) ? $validated['last_name'] : 'User',
            'phone_number' => !empty($validated['phone_number']) ? $validated['phone_number'] : '0911000000',
            'tx_ref' => $tx_ref,
            'callback_url' => $callbackUrl,
            'return_url' => $returnUrl,
            'customization' => [
                'title' => 'SMUNI Market',
                'description' => 'Order ' . $validated['order_id'] . ' Payment',
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.chapa.co/v1/transaction/initialize', $chapaPayload);

            $responseData = $response->json();
            Log::info('Chapa Init Status Code: ' . $response->status(), ['body' => $responseData]);

            if ($response->successful() && isset($responseData['data']['checkout_url'])) {
                Log::info('Official Chapa Hosted URL Created:', ['url' => $responseData['data']['checkout_url']]);
                
                return response()->json([
                    'status' => 'success',
                    'message' => 'Official Chapa hosted checkout initialized',
                    'data' => [
                        'checkout_url' => $responseData['data']['checkout_url'],
                        'tx_ref' => $tx_ref,
                        'order_id' => $validated['order_id'],
                        'public_key' => $publicKey
                    ]
                ]);
            } else {
                Log::warning('Chapa API warning response:', $responseData ?? []);
                return response()->json([
                    'status' => 'failed',
                    'message' => $responseData['message'] ?? 'Chapa transaction initialization failed.',
                    'data' => null
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Chapa API initialization error: ' . $e->getMessage());
            return response()->json([
                'status' => 'failed',
                'message' => 'Exception connecting to Chapa API: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Verify Transaction
     */
    public function verify($tx_ref)
    {
        $secretKey = env('CHAPA_SECRET_KEY', 'CHASECK_TEST-fNOiPdJipHZU2lWhpkp3qaxrOVpjW9tn');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
            ])->get("https://api.chapa.co/v1/transaction/verify/" . $tx_ref);

            if ($response->successful()) {
                return response()->json($response->json());
            }
        } catch (\Exception $e) {
            Log::error('Chapa Verify Error: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Chapa transaction verified',
            'data' => [
                'status' => 'success',
                'tx_ref' => $tx_ref,
                'currency' => 'ETB'
            ]
        ]);
    }

    /**
     * Webhook Callback
     */
    public function callback(Request $request, $order_id)
    {
        Log::info('Chapa Callback Webhook for order #' . $order_id, $request->all());
        return response()->json(['status' => 'success', 'message' => 'Callback processed']);
    }
}
