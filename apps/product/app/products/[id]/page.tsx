'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    createdAt: string;
}

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    orderDate: string;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getStockStatus(stock: number): { label: string; color: string } {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (stock < 20) return { label: 'Low Stock', color: '#f59e0b' };
    if (stock < 50) return { label: 'In Stock', color: '#3b82f6' };
    return { label: 'Well Stocked', color: '#10b981' };
}

export default function ProductDetailsPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch product details
                const productResponse = await fetch(`/products/api/products?id=${params.id}`);
                const productData = await productResponse.json();
                setProduct(productData);

                // Fetch all orders to find sales history
                const ordersResponse = await fetch('/sales/api/orders');
                const ordersData = await ordersResponse.json();

                // Filter orders that contain this product
                const productOrders = ordersData.filter((order: Order) =>
                    order.items.some(item => item.productId === parseInt(params.id as string))
                );
                setOrders(productOrders);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadSpec = () => {
        if (!product) return;

        const stockStatus = getStockStatus(product.stock);
        const totalSold = orders.reduce((sum, order) => {
            const item = order.items.find(i => i.productId === product.id);
            return sum + (item?.quantity || 0);
        }, 0);

        // Create product specification sheet
        const specContent = `
PRODUCT SPECIFICATION SHEET
========================================

Product ID: #${product.id}
Product Name: ${product.name}
Category: ${product.category}

========================================
DESCRIPTION
========================================

${product.description}

========================================
PRICING & INVENTORY
========================================

Unit Price: ${formatPrice(product.price)}
Current Stock: ${product.stock} units
Stock Status: ${stockStatus.label}
Stock Value: ${formatPrice(product.price * product.stock)}

========================================
SALES INFORMATION
========================================

Total Units Sold: ${totalSold}
Number of Orders: ${orders.length}
Total Revenue: ${formatPrice(totalSold * product.price)}

========================================
SALES HISTORY
========================================

${orders.length > 0 ? orders.map((order, index) => {
            const item = order.items.find(i => i.productId === product.id);
            return `${index + 1}. Order ${order.orderNumber}
   Customer: ${order.customerName}
   Quantity: ${item?.quantity || 0}
   Date: ${formatDate(order.orderDate)}
   Status: ${order.status.toUpperCase()}`;
        }).join('\n\n') : 'No sales history available.'}

========================================
PRODUCT DETAILS
========================================

Added to Catalog: ${formatDate(product.createdAt)}
Last Updated: ${formatDate(product.createdAt)}

========================================

For more information, contact: support@example.com
        `.trim();

        // Create blob and download
        const blob = new Blob([specContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `product-${product.id}-specification.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading product details...</p>
            </main>
        );
    }

    if (!product) {
        return (
            <main style={{ padding: '2rem' }}>
                <h1>Product Not Found</h1>
                <p>The product you're looking for doesn't exist.</p>
                <a href="/products" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                    ← Back to Products
                </a>
            </main>
        );
    }

    const stockStatus = getStockStatus(product.stock);
    const totalSold = orders.reduce((sum, order) => {
        const item = order.items.find(i => i.productId === product.id);
        return sum + (item?.quantity || 0);
    }, 0);

    return (
        <>
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header with Actions */}
                <div className="no-print" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <a
                                href="/products"
                                style={{
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                ← Back to Products
                            </a>
                            <span style={{ color: '#d1d5db' }}>|</span>
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
                        </div>
                        <h1 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                            Product Details
                        </h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            Product #{product.id}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handlePrint}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                color: '#374151',
                                fontWeight: '500',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            🖨️ Print Spec Sheet
                        </button>
                        <button
                            onClick={handleDownloadSpec}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#3b82f6',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: '500',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            📥 Download Spec Sheet
                        </button>
                    </div>
                </div>

                {/* Product Details Container */}
                <div style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '3rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    {/* Product Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '3rem',
                        paddingBottom: '2rem',
                        borderBottom: '2px solid #e5e7eb'
                    }}>
                        <div>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                background: product.category === 'Electronics' ? '#dbeafe' : '#fce7f3',
                                color: product.category === 'Electronics' ? '#1e40af' : '#be185d',
                                marginBottom: '1rem'
                            }}>
                                {product.category}
                            </div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                margin: 0,
                                marginBottom: '0.5rem'
                            }}>
                                {product.name}
                            </h2>
                            <p style={{ color: '#6b7280', margin: 0, fontSize: '1.125rem' }}>
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* Product Information Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '3rem',
                        marginBottom: '3rem'
                    }}>
                        {/* Pricing & Inventory */}
                        <div>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '1.5rem'
                            }}>
                                Pricing & Inventory
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ color: '#6b7280' }}>Unit Price:</span>
                                    <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#3b82f6' }}>
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ color: '#6b7280' }}>Current Stock:</span>
                                    <span style={{ fontWeight: '600' }}>{product.stock} units</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ color: '#6b7280' }}>Stock Status:</span>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        background: `${stockStatus.color}20`,
                                        color: stockStatus.color
                                    }}>
                                        {stockStatus.label}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ color: '#6b7280' }}>Stock Value:</span>
                                    <span style={{ fontWeight: '600' }}>
                                        {formatPrice(product.price * product.stock)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sales Information */}
                        <div>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '1.5rem'
                            }}>
                                Sales Information
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f0fdf4',
                                    borderRadius: '8px',
                                    border: '1px solid #bbf7d0'
                                }}>
                                    <span style={{ color: '#166534' }}>Total Units Sold:</span>
                                    <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#15803d' }}>
                                        {totalSold}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f0fdf4',
                                    borderRadius: '8px',
                                    border: '1px solid #bbf7d0'
                                }}>
                                    <span style={{ color: '#166534' }}>Number of Orders:</span>
                                    <span style={{ fontWeight: '600', color: '#15803d' }}>
                                        {orders.length}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: '#f0fdf4',
                                    borderRadius: '8px',
                                    border: '1px solid #bbf7d0'
                                }}>
                                    <span style={{ color: '#166534' }}>Total Revenue:</span>
                                    <span style={{ fontWeight: '600', color: '#15803d' }}>
                                        {formatPrice(totalSold * product.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales History */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '1.5rem'
                        }}>
                            Sales History ({orders.length} orders)
                        </h3>

                        {orders.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    fontSize: '0.875rem'
                                }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                                Order #
                                            </th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                                Customer
                                            </th>
                                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                                Quantity
                                            </th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                                Revenue
                                            </th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                                Date
                                            </th>
                                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => {
                                            const item = order.items.find(i => i.productId === product.id);
                                            if (!item) return null;

                                            return (
                                                <tr
                                                    key={order.id}
                                                    style={{ borderBottom: '1px solid #e5e7eb' }}
                                                >
                                                    <td style={{ padding: '1rem' }}>
                                                        <a
                                                            href={`/sales/${order.id}`}
                                                            style={{
                                                                color: '#3b82f6',
                                                                textDecoration: 'none',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {order.orderNumber}
                                                        </a>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#374151' }}>
                                                        {order.customerName}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                                        {item.quantity}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                                        {formatPrice(item.quantity * item.price)}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                                                        {formatDate(order.orderDate)}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500',
                                                            background: order.status === 'completed' ? '#dcfce7' :
                                                                order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                                                            color: order.status === 'completed' ? '#166534' :
                                                                order.status === 'shipped' ? '#1e40af' : '#92400e'
                                                        }}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                background: '#f9fafb',
                                borderRadius: '8px',
                                color: '#6b7280'
                            }}>
                                <p style={{ margin: 0, fontSize: '1.125rem' }}>
                                    No sales history available for this product.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '2px solid #e5e7eb',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            margin: 0,
                            marginBottom: '0.5rem'
                        }}>
                            Product added to catalog on {formatDate(product.createdAt)}
                        </p>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            margin: 0
                        }}>
                            For questions about this product, contact support@example.com
                        </p>
                    </div>
                </div>

                {/* Additional Actions */}
                <div className="no-print" style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#0369a1'
                }}>
                    <strong>💡 Tip:</strong> Use the Print button to print this specification sheet or save it as PDF.
                    The Download button will save a text version of the product details.
                </div>
            </main>
        </>
    );
}
