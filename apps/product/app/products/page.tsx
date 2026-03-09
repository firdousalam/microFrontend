import { readFileSync } from 'fs';
import { join } from 'path';

function getProducts() {
    const filePath = join(process.cwd(), 'data', 'products.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

function getOrders() {
    const filePath = join(process.cwd(), '..', 'sales', 'data', 'orders.json');
    try {
        const fileContents = readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch {
        return [];
    }
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

function getProductSalesCount(productId: number, orders: any[]): number {
    return orders.reduce((count, order) => {
        const itemCount = order.items.filter((item: any) => item.productId === productId).length;
        return count + itemCount;
    }, 0);
}

function getStockStatus(stock: number): { label: string; color: string } {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (stock < 20) return { label: 'Low Stock', color: '#f59e0b' };
    if (stock < 50) return { label: 'In Stock', color: '#3b82f6' };
    return { label: 'Well Stocked', color: '#10b981' };
}

export default function ProductsPage() {
    const products = getProducts();
    const orders = getOrders();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum: number, p: any) => sum + p.stock, 0);
    const totalValue = products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0);

    return (
        <main style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <a
                        href="/dashboard"
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        📊 Dashboard
                    </a>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <a
                        href="/sales"
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        💰 Sales
                    </a>
                </div>
                <h1>📦 Product Catalog</h1>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    Browse and manage product inventory
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    padding: '1.5rem',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
                        Total Products
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0284c7' }}>
                        {totalProducts}
                    </p>
                </div>
                <div style={{
                    padding: '1.5rem',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                        Total Stock
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d' }}>
                        {totalStock}
                    </p>
                </div>
                <div style={{
                    padding: '1.5rem',
                    background: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fde68a'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem' }}>
                        Inventory Value
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b45309' }}>
                        {formatPrice(totalValue)}
                    </p>
                </div>
            </div>

            <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>All Products</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.875rem'
                    }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                    ID
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Product Name
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Category
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                    Price
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                    Stock
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                    Status
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                    Sales
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => {
                                const stockStatus = getStockStatus(product.stock);
                                const salesCount = getProductSalesCount(product.id, orders);

                                return (
                                    <tr
                                        key={product.id}
                                        style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '1rem', color: '#6b7280', fontWeight: '500' }}>
                                            #{product.id}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '500', color: '#1f2937' }}>
                                                {product.name}
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#6b7280',
                                                marginTop: '0.25rem',
                                                maxWidth: '300px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {product.description}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                background: product.category === 'Electronics' ? '#dbeafe' : '#fce7f3',
                                                color: product.category === 'Electronics' ? '#1e40af' : '#be185d'
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                                            {formatPrice(product.price)}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#1f2937' }}>
                                            {product.stock}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                background: `${stockStatus.color}20`,
                                                color: stockStatus.color
                                            }}>
                                                {stockStatus.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: salesCount > 0 ? '#dcfce7' : '#f3f4f6',
                                                color: salesCount > 0 ? '#166534' : '#6b7280'
                                            }}>
                                                {salesCount} sold
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <a
                                                href={`/products/${product.id}`}
                                                style={{
                                                    color: '#3b82f6',
                                                    textDecoration: 'none',
                                                    fontWeight: '500',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                View Details →
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#0369a1'
            }}>
                <strong>💡 Tip:</strong> Click "View Details" to see complete product information including sales history and stock details.
            </div>
        </main>
    );
}
