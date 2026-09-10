import re

with open('app/Models/Product.php', 'r') as f:
    content = f.read()

# Add features to fillable
if "'features'" not in content:
    fillable_regex = r"'status',\n    \];"
    fillable_replace = "'status',\n        'features',\n    ];"
    content = re.sub(fillable_regex, fillable_replace, content)

# Add features to casts
if "'features' => 'array'" not in content:
    casts_regex = r"'discount' => 'decimal:2',\n        \];"
    casts_replace = "'discount' => 'decimal:2',\n            'features' => 'array',\n        ];"
    content = re.sub(casts_regex, casts_replace, content)

with open('app/Models/Product.php', 'w') as f:
    f.write(content)
