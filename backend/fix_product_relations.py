import re

with open('app/Models/Product.php', 'r') as f:
    content = f.read()

variant_relation = """    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function primaryImage"""

if "function variants()" not in content:
    content = content.replace("    public function primaryImage", variant_relation)

with open('app/Models/Product.php', 'w') as f:
    f.write(content)
