import { NextResponse } from 'next/server';

// Mock sales data - in production, this would come from a database
const orders = [
    { id: 1, productId: 1, quantity: 2, totalPrice: 2598, status: 'completed' },
    { id: 2, productId: 2, quantity: 5, totalPrice: 145, status: 'completed' },
    { id: 3, productId: 3, quantity: 3, totalPrice: 267, status: 'pending' },
    { id: 4, productId: 1, quantity: 1, totalPrice: 1299, status: 'completed' },
    { id: 5, productId: 5, quantity: 2, totalPrice: 798, status: 'completed' },
];

export async function GET() {
    // Calculate statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalRevenue / completedOrders.length;

    const stats = {
        totalOrders,
        completedOrders: completedOrders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    };

    return NextResponse.json(stats);
}
