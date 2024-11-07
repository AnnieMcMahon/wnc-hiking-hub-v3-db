import { sql } from '@vercel/postgres';

export async function fetchTrails() {
  try {
    const data = await sql`SELECT * FROM alltrails`;
    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trail data.');
  }
}
