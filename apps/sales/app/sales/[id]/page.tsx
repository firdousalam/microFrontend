import { readFileSync } from 'fs';
import { join } from 'path';
import OrderDetailsClient from './OrderDetailsClient';

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

function getOrder(id: string): Order | null {
    const filePath = join(process.cwd(), 'data', 'orders.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const orders = JSON.parse(fileContents);
    return orders.find((order: Order) => order.id === parseInt(id)) || null;
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = getOrder(params.id);

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

    return <OrderDetailsClient order={order} />;
}
