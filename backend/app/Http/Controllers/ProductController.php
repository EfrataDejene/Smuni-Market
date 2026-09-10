<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with(['images', 'category', 'brand', 'variants'])->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:Pending,Approved,Rejected']);
        $product = Product::findOrFail($id);
        $product->status = $request->status;
        $product->save();
        return response()->json(['message' => 'Status updated successfully', 'product' => $product]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id'            => 'required|integer',
            'category_id'          => 'required|integer',
            'brand_id'             => 'required|integer',
            'name'                 => 'required|string|max:255',
            'description'          => 'nullable|string',
            'price'                => 'required|numeric',
            'discount_percentage'  => 'nullable|numeric',
            'discount'             => 'nullable|numeric',
            'off_price'            => 'nullable|numeric',
            'status'               => 'nullable|string',
            'features'             => 'nullable|array',
        ]);

        $validated['status'] = $validated['status'] ?? 'Pending';

        // Normalize discount field (accept either name from frontend)
        if (!isset($validated['discount']) && isset($validated['discount_percentage'])) {
            $validated['discount'] = $validated['discount_percentage'];
        }
        unset($validated['discount_percentage']);

        $product = Product::create($validated);

        if ($request->has('image') && !empty($request->image)) {
            $product->images()->create(['image_path' => $request->image, 'is_primary' => true]);
        }

        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $v) {
                $product->variants()->create([
                    'color'     => $v['color']    ?? null,
                    'size'      => $v['size']     ?? null,
                    'price'     => isset($v['price'])    && $v['price']    !== '' ? $v['price']    : null,
                    'off_price' => isset($v['offPrice']) && $v['offPrice'] !== '' ? $v['offPrice'] : null,
                    'stock'     => $v['stock'] ?? 0,
                    'image'     => $v['image'] ?? null,
                ]);
            }
        }

        // Auto-create inventory record so stock shows correctly immediately
        $initialStock = $request->input('stock', 0);
        Inventory::firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => $initialStock, 'low_stock_threshold' => 5, 'stock_status' => $initialStock > 0 ? 'Available' : 'Out of Stock']
        );

        return response()->json([
            'message' => 'Product created',
            'product' => $product->load(['images', 'category', 'brand', 'variants'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->only([
            'category_id', 'brand_id', 'name', 'description',
            'price', 'off_price', 'discount', 'discount_percentage', 'status', 'features'
        ]));

        if ($request->has('image') && !empty($request->image)) {
            $product->images()->delete();
            $product->images()->create(['image_path' => $request->image, 'is_primary' => true]);
        }

        if ($request->has('variants') && is_array($request->variants)) {
            $product->variants()->delete();
            foreach ($request->variants as $v) {
                $product->variants()->create([
                    'color'     => $v['color']    ?? null,
                    'size'      => $v['size']     ?? null,
                    'price'     => isset($v['price'])    && $v['price']    !== '' ? $v['price']    : null,
                    'off_price' => isset($v['offPrice']) && $v['offPrice'] !== '' ? $v['offPrice'] : null,
                    'stock'     => $v['stock'] ?? 0,
                    'image'     => $v['image'] ?? null,
                ]);
            }
        }

        return response()->json([
            'message' => 'Product updated',
            'product' => $product->load(['images', 'category', 'brand', 'variants'])
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
