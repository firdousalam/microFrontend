import { NextResponse } from 'next/server';

// Mock product data - in production, this would come from a database
const products = [
    { id: 1, name: 'Laptop Pro', price: 1299, stock: 15, category: 'Electronics' },
    { id: 2, name: 'Wireless Mouse', price: 29, stock: 50, category: 'Accessories' },
    { id: 3, name: 'Mechanical Keyboard', price: 89, stock: 30, category: 'Accessories' },
    { id: 4, name: 'USB-C Hub', price: 49, stock: 25, category: 'Accessories' },
    { id: 5, name: 'Monitor 27"', price: 399, stock: 12, category: 'Electronics' },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Get single product by ID
    if (id) {
        const product = products.find(p => p.id === parseInt(id));
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(product);
    }

    // Get all products
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.price) {
            return NextResponse.json(
                { error: 'Name and price are required' },
                { status: 400 }
            );
        }

        const newProduct = {
            id: products.length + 1,
            name: body.name,
            price: body.price,
            stock: body.stock || 0,
            category: body.category || 'Uncategorized',
        };

        products.push(newProduct);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
