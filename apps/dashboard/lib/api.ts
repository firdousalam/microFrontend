// API client for calling other services
// This demonstrates the API-based communication pattern

const API_BASE_URLS = {
    product: process.env.NEXT_PUBLIC_PRODUCT_API || 'http://localhost:3003',
    sales: process.env.NEXT_PUBLIC_SALES_API || 'http://localhost:3004',
    auth: process.env.NEXT_PUBLIC_AUTH_API || 'http://localhost:3001',
};

// Product API calls
export async function getProducts() {
    try {
        const response = await fetch(`${API_BASE_URLS.product}/api/products`, {
            cache: 'no-store', // Disable caching for demo purposes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return empty array as fallback
        return [];
    }
}

export async function getProduct(id: number) {
    try {
        const response = await fetch(`${API_BASE_URLS.product}/api/products?id=${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Sales API calls
export async function getSalesStats() {
    try {
        const response = await fetch(`${API_BASE_URLS.sales}/api/stats`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sales stats: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching sales stats:', error);
        // Return default stats as fallback
        return {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
        };
    }
}

// Helper function to format currency
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}
