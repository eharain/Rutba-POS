// components/filter/product-filter.js
import { useState, useEffect } from "react";
import { authApi } from "../../lib/api";
export  function ProductFilter({ onFilterChange }) {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [termTypes, setTermTypes] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        Promise.all([
            authApi.fetch("/brands"),
            authApi.fetch("/categories"),
            authApi.fetch("/suppliers"),
            authApi.fetch("/term-types",   { populate: ["terms"] } ),
        ]).then(([b, c, s, t]) => {
            setBrands(b?.data || []);
            setCategories(c?.data || []);
            setSuppliers(s?.data || []);
            setTermTypes(t?.data || []);
        });
    }, []);

    // Build query object
    useEffect(() => {


        const filters = { brand: selectedBrand, category: selectedCategory, supplier: selectedSupplier, term: selectedTerm, inStockOnly }


        //const filters = {
        //    ...(selectedBrand) ? { brands: { populate: "*", selectedBrand } } : {},
        //    ...(selectedCategory) ? { categories: { populate: "*", selectedCategory } } : {}
        //}



        //if (selectedBrand) filters["filters[brands][id][$in]"] = selectedBrand;
        //if (selectedCategory) filters["filters[categories][id][$in]"] = selectedCategory;
        //if (selectedSupplier) filters["filters[suppliers][id][$in]"] = selectedSupplier;
        //if (selectedTerm) filters["filters[terms][id][$in]"] = selectedTerm;
        //if (inStockOnly) filters["filters[items][status][$eq]"] = "InStock";

        // Pass query object upwards
        onFilterChange(filters);
    }, [selectedBrand, selectedCategory, selectedSupplier, selectedTerm, inStockOnly]);

    return (
        <div className="grid grid-cols-5 gap-3 mb-4 items-center">
            {/* Brand */}
            hello
            <select
                className="border p-2 rounded"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
            >
                <option value="">All Brands</option>
                {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                        {b.name}
                    </option>
                ))}
            </select>

            {/* Category */}
            <select
                className="border p-2 rounded"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Supplier */}
            <select
                className="border p-2 rounded"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
            >
                <option value="">All Suppliers</option>
                {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>

            {/* Term / Term-Type */}
            <select
                className="border p-2 rounded"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
            >
                <option value="">All Terms</option>
                {termTypes.map((tt) =>
                    tt.terms?.map((t) => (
                        <option key={t.id} value={t.id}>
                            {tt.name} - {t.name}
                        </option>
                    ))
                )}
            </select>

            {/* In Stock Checkbox */}
            <label className="flex items-center space-x-2 text-sm">
                <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
            </label>
        </div>
    );
}
