import { db } from "@vercel/postgres";
import { allTrails } from "@/app/lib/seed";

const client = await db.connect();

async function seedAllTrails() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS allTrails (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      area VARCHAR(255) NOT NULL,
      difficulty VARCHAR(12) NOT NULL,
      length DECIMAL NOT NULL,
      elevation INT,
      type VARCHAR(20),
      link VARCHAR(255)
    );
  `;
  const insertedTrails = await Promise.all(
    allTrails.map(async (trail) => {
      return client.sql`
        INSERT INTO allTrails (id, name, area, difficulty, length, elevation, type, link)
        VALUES (${trail.id}, ${trail.name}, ${trail.area}, ${trail.difficulty}, ${trail.length}, ${trail.elevation}, ${trail.type}, ${trail.link})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
  return insertedTrails;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedAllTrails();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}