'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    orderNumber: string;
    customerId: number;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    orderDate: string;
    shippingAddress: string;
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'completed':
            return '#10b981';
        case 'shipped':
            return '#3b82f6';
        case 'pending':
            return '#f59e0b';
        default:
            return '#6b7280';
    }
}

function getStatusBadge(status: string): string {
    switch (status) {
        case 'completed':
            return '✓ Completed';
        case 'shipped':
            return '📦 Shipped';
        case 'pending':
            return '⏳ Pending';
        default:
            return status;
    }
}

export default function OrderDetailsPage() {
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(`/sales/api/orders?id=${params.id}`);
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [params.id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadInvoice = () => {
        if (!order) return;

        // Create invoice content
        const invoiceContent = `
INVOICE
========================================

Order Number: ${order.orderNumber}
Order Date: ${formatDate(order.orderDate)}
Status: ${order.status.toUpperCase()}

========================================
CUSTOMER INFORMATION
========================================

Name: ${order.customerName}
Email: ${order.customerEmail}
Shipping Address: ${order.shippingAddress}

========================================
ORDER ITEMS
========================================

${order.items.map((item, index) => `
${index + 1}. ${item.productName}
   Quantity: ${item.quantity}
   Unit Price: ${formatPrice(item.price)}
   Subtotal: ${formatPrice(item.quantity * item.price)}
`).join('\n')}

========================================
SUMMARY
========================================

Subtotal: ${formatPrice(order.totalPrice)}
Tax (0%): $0.00
Shipping: $0.00
----------------------------------------
TOTAL: ${formatPrice(order.totalPrice)}

========================================

Thank you for your business!

For questions, contact: support@example.com
        `.trim();

        // Create blob and download
        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.orderNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading order details...</p>
            </main>
        );
    }

    if (!order) {
        return (
            <main style={{ padding: '2rem' }}>
                <h1>Order Not Found</h1>
                <p>The order you're looking for doesn't exist.</p>
                <a href="/sales" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                    ← Back to Orders
                </a>
            </main>
        );
    }

    const subtotal = order.totalPrice;
    const tax = 0;
    const shipping = 0;
    const total = subtotal + tax + shipping;

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
                                href="/sales"
                                style={{
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                ← Back to Orders
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
                            Order Details
                        </h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            {order.orderNumber}
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
                            🖨️ Print Invoice
                        </button>
                        <button
                            onClick={handleDownloadInvoice}
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
                            📥 Download Invoice
                        </button>
                    </div>
                </div>

                {/* Invoice Container */}
                <div style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '3rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    {/* Invoice Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '3rem',
                        paddingBottom: '2rem',
                        borderBottom: '2px solid #e5e7eb'
                    }}>
                        <div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                margin: 0,
                                marginBottom: '0.5rem'
                            }}>
                                INVOICE
                            </h2>
                            <p style={{ color: '#6b7280', margin: 0 }}>
                                Order #{order.orderNumber}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                background: `${getStatusColor(order.status)}20`,
                                color: getStatusColor(order.status)
                            }}>
                                {getStatusBadge(order.status)}
                            </div>
                            <p style={{ color: '#6b7280', marginTop: '1rem', marginBottom: 0 }}>
                                Date: {formatDate(order.orderDate)}
                            </p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        <div>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '1rem'
                            }}>
                                Bill To
                            </h3>
                            <div>
                                <p style={{ fontWeight: '600', margin: 0, marginBottom: '0.25rem' }}>
                                    {order.customerName}
                                </p>
                                <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>
                                    {order.customerEmail}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '1rem'
                            }}>
                                Ship To
                            </h3>
                            <p style={{ color: '#374151', margin: 0 }}>
                                {order.shippingAddress}
                            </p>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div style={{ marginBottom: '3rem' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>
                            <thead>
                                <tr style={{
                                    borderBottom: '2px solid #e5e7eb',
                                    background: '#f9fafb'
                                }}>
                                    <th style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Item
                                    </th>
                                    <th style={{
                                        padding: '1rem',
                                        textAlign: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Quantity
                                    </th>
                                    <th style={{
                                        padding: '1rem',
                                        textAlign: 'right',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Unit Price
                                    </th>
                                    <th style={{
                                        padding: '1rem',
                                        textAlign: 'right',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr
                                        key={index}
                                        style={{ borderBottom: '1px solid #e5e7eb' }}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div>
                                                <p style={{
                                                    fontWeight: '500',
                                                    margin: 0,
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {item.productName}
                                                </p>
                                                <p style={{
                                                    fontSize: '0.75rem',
                                                    color: '#6b7280',
                                                    margin: 0
                                                }}>
                                                    Product ID: #{item.productId}
                                                </p>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            textAlign: 'center',
                                            fontWeight: '500'
                                        }}>
                                            {item.quantity}
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            textAlign: 'right',
                                            color: '#6b7280'
                                        }}>
                                            {formatPrice(item.price)}
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}>
                                            {formatPrice(item.quantity * item.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Summary */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <div style={{ width: '300px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <span style={{ color: '#6b7280' }}>Subtotal:</span>
                                <span style={{ fontWeight: '500' }}>{formatPrice(subtotal)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <span style={{ color: '#6b7280' }}>Tax (0%):</span>
                                <span style={{ fontWeight: '500' }}>{formatPrice(tax)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '2px solid #e5e7eb'
                            }}>
                                <span style={{ color: '#6b7280' }}>Shipping:</span>
                                <span style={{ fontWeight: '500' }}>{formatPrice(shipping)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '1rem 0',
                                fontSize: '1.25rem'
                            }}>
                                <span style={{ fontWeight: '600' }}>Total:</span>
                                <span style={{ fontWeight: '700', color: '#3b82f6' }}>
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </div>
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
                            Thank you for your business!
                        </p>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            margin: 0
                        }}>
                            For questions about this invoice, contact support@example.com
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
                    <strong>💡 Tip:</strong> Use the Print button to print this invoice or save it as PDF.
                    The Download button will save a text version of the invoice.
                </div>
            </main>
        </>
    );
}
