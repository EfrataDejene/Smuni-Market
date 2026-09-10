import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# 1. handleAddCategorySubmit
search = """      if (isEditing) {
        const category = categories.find(item => item.id === editingCategoryId);
        await updateCategory(editingCategoryId, catNameInput, catTypeInput === 'sub' ? catParentInput : '', category?.status || 'Active');
      } else {
        await addCategory(catNameInput, 'Layers', catTypeInput === 'sub' ? catParentInput : '');
      }
      setCatNameInput('');
      setCatTypeInput('main');
      setCatParentInput('');"""
replace = """      if (isEditing) {
        const category = categories.find(item => item.id === editingCategoryId);
        await updateCategory(editingCategoryId, catNameInput, catTypeInput === 'sub' ? catParentInput : '', category?.status || 'Active', catTypeInput === 'sub' ? catBrandInput : '');
      } else {
        await addCategory(catNameInput, 'Layers', catTypeInput === 'sub' ? catParentInput : '', catTypeInput === 'sub' ? catBrandInput : '');
      }
      setCatNameInput('');
      setCatTypeInput('main');
      setCatParentInput('');
      setCatBrandInput('');"""
content = content.replace(search, replace)

# 2. openCategoryForm
search = """  const openCategoryForm = (type) => {
    setActiveSection(type === 'sub' ? 'subcategories' : 'categories');
    setCatNameInput('');
    setCatTypeInput(type);
    setCatParentInput('');
    setEditingCategoryId(null);
    setShowAddCategoryModal(true);
  };"""
replace = """  const openCategoryForm = (type) => {
    setActiveSection(type === 'sub' ? 'subcategories' : 'categories');
    setCatNameInput('');
    setCatTypeInput(type);
    setCatParentInput('');
    setCatBrandInput('');
    setEditingCategoryId(null);
    setShowAddCategoryModal(true);
  };"""
content = content.replace(search, replace)

# 3. Category modal edit button
search = """<button onClick={() => { setEditingCategoryId(c.id); setCatNameInput(c.name); setCatTypeInput(c.parent_id ? 'sub' : 'main'); setCatParentInput(c.parent_id ? String(c.parent_id) : ''); setShowAddCategoryModal(true); }} className="text-indigo-500 hover:text-indigo-700">"""
replace = """<button onClick={() => { setEditingCategoryId(c.id); setCatNameInput(c.name); setCatTypeInput(c.parent_id ? 'sub' : 'main'); setCatParentInput(c.parent_id ? String(c.parent_id) : ''); setCatBrandInput(c.brand_id ? String(c.brand_id) : ''); setShowAddCategoryModal(true); }} className="text-indigo-500 hover:text-indigo-700">"""
content = content.replace(search, replace)

# 4. Add Category Button
search = """<button onClick={() => { setEditingCategoryId(null); setCatNameInput(''); setCatTypeInput(isSubcategorySection ? 'sub' : 'main'); setCatParentInput(''); setShowAddCategoryModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">"""
replace = """<button onClick={() => { setEditingCategoryId(null); setCatNameInput(''); setCatTypeInput(isSubcategorySection ? 'sub' : 'main'); setCatParentInput(''); setCatBrandInput(''); setShowAddCategoryModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">"""
content = content.replace(search, replace)

# 5. Cancel button
search = """<button type="button" onClick={() => { setShowAddCategoryModal(false); setEditingCategoryId(null); setCatNameInput(''); setCatTypeInput('main'); setCatParentInput(''); }} className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>"""
replace = """<button type="button" onClick={() => { setShowAddCategoryModal(false); setEditingCategoryId(null); setCatNameInput(''); setCatTypeInput('main'); setCatParentInput(''); setCatBrandInput(''); }} className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>"""
content = content.replace(search, replace)

# 6. Category Form inputs
search = """                  {catTypeInput === 'sub' && <select
                    value={catParentInput}
                    onChange={e => setCatParentInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="">Select parent category</option>
                    {categories.filter(category => category.id !== editingCategoryId && !category.parent_id).map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>}"""
replace = """                  {catTypeInput === 'sub' && (
                    <>
                      <select
                        value={catParentInput}
                        onChange={e => setCatParentInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                        required
                      >
                        <option value="">Select parent category</option>
                        {categories.filter(category => category.id !== editingCategoryId && !category.parent_id).map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      <select
                        value={catBrandInput}
                        onChange={e => setCatBrandInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                      >
                        <option value="">Select associated brand (Optional)</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                    </>
                  )}"""
content = content.replace(search, replace)

# 7. Category List Display
search = """                    <div className="flex-1">
                      <p className="font-extrabold text-slate-800 text-sm">{c.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {isSubcategorySection ? `Subcategory of: ${c.parent?.name || 'Unknown'}` : `Main Category • ${c.productsCount} products`}
                      </p>
                    </div>"""
replace = """                    <div className="flex-1">
                      <p className="font-extrabold text-slate-800 text-sm">{c.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {isSubcategorySection ? `Subcategory of: ${c.parent?.name || 'Unknown'}` : `Main Category • ${c.productsCount} products`}
                        {isSubcategorySection && c.brand_id && ` • Brand: ${brands.find(b => b.id === c.brand_id)?.name || 'Unknown'}`}
                      </p>
                    </div>"""
content = content.replace(search, replace)

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)

