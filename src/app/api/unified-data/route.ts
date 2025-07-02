import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const dataPath = path.join(process.cwd(), 'data', 'products.json');

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Data file not found' },
        { status: 404 }
      );
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    if (category) {
      const categoryData = data.categories[category] || [];
      return NextResponse.json({
        category,
        data: categoryData,
        count: categoryData.length,
        lastUpdated: data.lastUpdated,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, data: newData } = body;

    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    let currentData = { categories: {} };

    if (fs.existsSync(dataPath)) {
      currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    if (category && newData) {
      currentData.categories[category] = newData;
      (currentData as any).lastUpdated = new Date().toISOString();

      fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));

      return NextResponse.json({
        success: true,
        category,
        count: newData.length,
        message: '데이터가 성공적으로 업데이트되었습니다.',
      });
    }

    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}
