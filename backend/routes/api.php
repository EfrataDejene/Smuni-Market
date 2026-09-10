<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::apiResource('categories', CategoryController::class)->only([
    'index',
    'store',
    'update',
    'destroy',
]);

Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/send-verification-otp', [UserController::class, 'sendVerificationOtp']);
Route::post('/verify-email-otp', [UserController::class, 'verifyEmailOtp']);
Route::post('/forgot-password', [UserController::class, 'sendPasswordResetOtp']);
Route::post('/verify-reset-otp', [UserController::class, 'verifyPasswordResetOtp']);
Route::post('/reset-password', [UserController::class, 'resetPasswordWithOtp']);
Route::match(['get', 'post'], '/test-email', [UserController::class, 'testEmail']);
Route::put('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::put('/users/{id}/status', [UserController::class, 'updateStatus']);
use App\Http\Controllers\ImageUploadController;
Route::post('/upload-image', [ImageUploadController::class, 'upload']);

use App\Http\Controllers\ProductController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ChapaController;
use App\Http\Controllers\DeliveryController;

Route::apiResource('products', ProductController::class)->except(['show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/inventory', [InventoryController::class, 'index']);
Route::put('/inventory/{productId}', [InventoryController::class, 'upsert']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::get('/brands', [BrandController::class, 'index']);
Route::put('/products/{id}/status', [ProductController::class, 'updateStatus']);

// Payment Transactions & Settlement Routes
Route::get('/payments', [PaymentController::class, 'index']);
Route::put('/payments/{id}/status', [PaymentController::class, 'updateStatus']);
Route::post('/payments/{id}/refund', [PaymentController::class, 'refund']);
Route::post('/payments/{id}/verify', [PaymentController::class, 'verify']);

// Chapa Payment Integration Routes
Route::post('/chapa/initialize', [ChapaController::class, 'initialize']);
Route::get('/chapa/verify/{tx_ref}', [ChapaController::class, 'verify']);
Route::post('/chapa/callback/{order_id}', [ChapaController::class, 'callback']);

// Delivery Fleet & Logistics Management Routes
Route::get('/delivery/fleet', [DeliveryController::class, 'getFleet']);
Route::post('/admin/delivery-personnel', [DeliveryController::class, 'createDeliveryPerson']);
Route::post('/delivery/assign', [DeliveryController::class, 'assign']);
Route::put('/delivery/{orderId}/status', [DeliveryController::class, 'updateStatus']);
Route::put('/admin/users/{id}/password', [DeliveryController::class, 'resetPassword']);
