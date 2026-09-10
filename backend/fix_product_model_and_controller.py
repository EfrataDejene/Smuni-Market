import re

# 1. Update Product.php to cast features
with open('app/Models/Product.php', 'r') as f:
    content = f.read()

casts_search = "        return [\n            'price' => 'decimal:2',\n            'discount_percentage' => 'decimal:2',\n        ];"
casts_replace = "        return [\n            'price' => 'decimal:2',\n            'discount_percentage' => 'decimal:2',\n            'features' => 'array',\n        ];"
if "features" not in content:
    content = content.replace(casts_search, casts_replace)
    
    # Also add it to fillable
    fillable_search = "'discount_percentage',\n        'status',\n    ];"
    fillable_replace = "'discount_percentage',\n        'status',\n        'features',\n    ];"
    content = content.replace(fillable_search, fillable_replace)

with open('app/Models/Product.php', 'w') as f:
    f.write(content)

# 2. Update ProductController.php to allow 'features'
with open('app/Http/Controllers/ProductController.php', 'r') as f:
    content = f.read()

# For store method
store_search = "'discount_percentage' => 'nullable|numeric',\n            'status' => 'nullable|string'\n        ]);"
store_replace = "'discount_percentage' => 'nullable|numeric',\n            'status' => 'nullable|string',\n            'features' => 'nullable|array'\n        ]);"
content = content.replace(store_search, store_replace)

# For update method
update_search = "'category_id', 'brand_id', 'name', 'description', 'price', 'discount_percentage', 'status'"
update_replace = "'category_id', 'brand_id', 'name', 'description', 'price', 'discount_percentage', 'status', 'features'"
content = content.replace(update_search, update_replace)

with open('app/Http/Controllers/ProductController.php', 'w') as f:
    f.write(content)

