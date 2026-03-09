import { readFileSync } from 'fs';
import { join } from 'path';

function getOrders() {
    const filePath = join(process.cwd(), 'data', 'orders.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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

export default function SalesPage() {
    const orders = getOrders();
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
    const completedOrders = orders.filter((o: any) => o.status === 'completed').length;

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
                        href="/products"
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        📦 Products
                    </a>
                </div>
                <h1>💰 Sales Management</h1>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    View and manage all orders
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
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                        Total Orders
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d' }}>
                        {orders.length}
                    </p>
                </div>
                <div style={{
                    padding: '1.5rem',
                    background: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem' }}>
                        Completed
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>
                        {completedOrders}
                    </p>
                </div>
                <div style={{
                    padding: '1.5rem',
                    background: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fde68a'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem' }}>
                        Total Revenue
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b45309' }}>
                        {formatPrice(totalRevenue)}
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
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>All Orders</h2>
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
                                    Order #
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Customer
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Items
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                    Total
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                    Status
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Date
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any) => (
                                <tr
                                    key={order.id}
                                    style={{
                                        borderBottom: '1px solid #e5e7eb',
                                        transition: 'background-color 0.2s'
                                    }}

                                >
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontWeight: '500', color: '#1f2937' }}>
                                            {order.orderNumber}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: '500', color: '#1f2937' }}>
                                                {order.customerName}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                {order.customerEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                                        {formatPrice(order.totalPrice)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            background: `${getStatusColor(order.status)}20`,
                                            color: getStatusColor(order.status)
                                        }}>
                                            {getStatusBadge(order.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                                        {formatDate(order.orderDate)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <a
                                            href={`/sales/${order.id}`}
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
                            ))}
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
                <strong>💡 Tip:</strong> Click "View Details" to see complete order information including items, shipping address, and more.
            </div>
        </main>
    );
}
