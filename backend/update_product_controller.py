import re

with open('app/Http/Controllers/ProductController.php', 'r') as f:
    content = f.read()

methods = """
    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id' => 'required|integer',
            'category_id' => 'required|integer',
            'brand_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'discount_percentage' => 'nullable|numeric',
            'status' => 'nullable|string'
        ]);
        
        $validated['status'] = $validated['status'] ?? 'Pending';
        
        $product = Product::create($validated);
        
        if ($request->has('image')) {
            $product->images()->create(['image_url' => $request->image, 'is_primary' => true]);
        }
        
        return response()->json(['message' => 'Product created', 'product' => $product->load(['images', 'category', 'brand'])], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->only([
            'category_id', 'brand_id', 'name', 'description', 'price', 'discount_percentage', 'status'
        ]));
        
        if ($request->has('image')) {
            $product->images()->delete();
            $product->images()->create(['image_url' => $request->image, 'is_primary' => true]);
        }
        
        return response()->json(['message' => 'Product updated', 'product' => $product->load(['images', 'category', 'brand'])]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
"""

content = content.replace("}", methods + "\n}")

with open('app/Http/Controllers/ProductController.php', 'w') as f:
    f.write(content)
