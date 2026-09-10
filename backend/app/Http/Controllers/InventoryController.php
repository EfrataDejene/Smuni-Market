<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(Inventory::all());
    }

    // Create or update stock for a product
    public function upsert(Request $request, $productId)
    {
        $request->validate([
            'quantity'            => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $qty       = (int) $request->quantity;
        $threshold = (int) ($request->low_stock_threshold ?? 5);

        $status = 'Available';
        if ($qty === 0)       $status = 'Out of Stock';
        elseif ($qty <= $threshold) $status = 'Low';

        $inv = Inventory::updateOrCreate(
            ['product_id' => $productId],
            ['quantity' => $qty, 'low_stock_threshold' => $threshold, 'stock_status' => $status]
        );

        return response()->json($inv);
    }
}
