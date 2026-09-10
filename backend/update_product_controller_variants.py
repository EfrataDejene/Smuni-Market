import re

with open('app/Http/Controllers/ProductController.php', 'r') as f:
    content = f.read()

# Update index method to include variants
content = content.replace("Product::with(['images', 'category', 'brand'])", "Product::with(['images', 'category', 'brand', 'variants'])")

# Update store method to handle variants
store_regex = r"(\$product->images\(\)->create\(\['image_url' => \$request->image, 'is_primary' => true\]\);\n        \})"
store_replace = r"""\1
        
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $v) {
                $product->variants()->create([
                    'color' => $v['color'] ?? null,
                    'size' => $v['size'] ?? null,
                    'price' => isset($v['price']) && $v['price'] !== '' ? $v['price'] : null,
                    'off_price' => isset($v['offPrice']) && $v['offPrice'] !== '' ? $v['offPrice'] : null,
                    'stock' => $v['stock'] ?? 0,
                    'image' => $v['image'] ?? null,
                ]);
            }
        }"""
if "foreach ($request->variants as $v)" not in content:
    content = re.sub(store_regex, store_replace, content)

# Update update method to handle variants
update_regex = r"(\$product->images\(\)->create\(\['image_url' => \$request->image, 'is_primary' => true\]\);\n        \})"
update_replace = r"""\1
        
        if ($request->has('variants') && is_array($request->variants)) {
            $product->variants()->delete();
            foreach ($request->variants as $v) {
                $product->variants()->create([
                    'color' => $v['color'] ?? null,
                    'size' => $v['size'] ?? null,
                    'price' => isset($v['price']) && $v['price'] !== '' ? $v['price'] : null,
                    'off_price' => isset($v['offPrice']) && $v['offPrice'] !== '' ? $v['offPrice'] : null,
                    'stock' => $v['stock'] ?? 0,
                    'image' => $v['image'] ?? null,
                ]);
            }
        }"""
if "product->variants()->delete()" not in content:
    content = re.sub(update_regex, update_replace, content)

# Update the load statements
content = content.replace("load(['images', 'category', 'brand'])", "load(['images', 'category', 'brand', 'variants'])")

with open('app/Http/Controllers/ProductController.php', 'w') as f:
    f.write(content)
