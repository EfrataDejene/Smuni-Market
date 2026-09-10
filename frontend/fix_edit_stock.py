import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

search_str = "const inv = inventory.find(i => i.productId === prod.productId);"
replace_str = "const inv = inventory.find(i => Number(i.productId) === Number(prod.productId));"

if search_str in content:
    content = content.replace(search_str, replace_str)
else:
    print("Could not find the startEditProduct inventory lookup in SellerDashboard.jsx")

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
