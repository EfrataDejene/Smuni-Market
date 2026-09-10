import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# Update useParams to include id
content = content.replace("const { section } = useParams();", "const { section, id } = useParams();")

# Remove viewingProduct state since it will be derived from URL
content = re.sub(r"const \[viewingProduct, setViewingProduct\] = useState\(null\);\n\s*", "", content)

# Change grid card onClick
content = content.replace("onClick={() => setViewingProduct(p)}", "onClick={() => navigate('/seller/dashboard/product/' + p.productId)}")

# Change the modal rendering into a full section
modal_regex = r"\{viewingProduct && \(\(\) => \{[\s\S]*?const displayImg = selectedVariant\?\.image \|\| viewingProduct\.image;[\s\S]*?return \([\s\S]*?<div className=\"fixed inset-0 z-\[100\][\s\S]*?<div className=\"bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-\[90vh\] overflow-hidden flex flex-col\">([\s\S]*?)<\/div>\n\s*<\/div>\n\s*\);\n\s*\}\)\(\)\}"

def modal_replacement(match):
    inner_content = match.group(1)
    
    # We need to change the Close button to navigate back
    inner_content = inner_content.replace(
        "onClick={() => { setViewingProduct(null); setSelectedVariant(null); }}",
        "onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }}"
    )
    
    # We need to change Edit button to navigate back to add_product and start editing
    inner_content = inner_content.replace(
        "onClick={() => { startEditProduct(viewingProduct); setViewingProduct(null); setSelectedVariant(null); setActiveSection('add_product'); }}",
        "onClick={() => { startEditProduct(viewingProduct); setSelectedVariant(null); navigate('/seller/dashboard/add_product'); }}"
    )
    
    # We need to change Delete button to navigate back after delete
    inner_content = inner_content.replace(
        "onClick={() => { deleteProduct(viewingProduct.productId); setViewingProduct(null); setSelectedVariant(null); triggerMessage(`Deleted ${viewingProduct.name}`); }}",
        "onClick={() => { deleteProduct(viewingProduct.productId); setSelectedVariant(null); navigate('/seller/dashboard/all_products'); triggerMessage(`Deleted ${viewingProduct.name}`); }}"
    )

    # Wrap it in a new section block
    new_block = """      {activeSection === 'product' && id && (() => {
        const viewingProduct = products.find(p => p.productId === Number(id) || String(p.productId) === id);
        if (!viewingProduct || viewingProduct.sellerId !== currentUser.userId) {
           return (
             <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
               <Package size={48} className="mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-bold text-slate-700">Product Not Found</h2>
               <button onClick={() => navigate('/seller/dashboard/all_products')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Go Back</button>
             </div>
           );
        }
        
        const displayImg = selectedVariant?.image || viewingProduct.image;
        const displayPrice = selectedVariant?.price || viewingProduct.price;
        const displayStock = selectedVariant ? selectedVariant.stock : (inventory.find(i => i.productId === viewingProduct.productId)?.quantity || 0);
        
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
""" + inner_content + """
          </div>
        );
      })()}"""
    return new_block

content = re.sub(modal_regex, modal_replacement, content)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
