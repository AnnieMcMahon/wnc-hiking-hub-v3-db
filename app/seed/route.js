import { supabase } from "@/app/lib/initSupabase";
import { allTrails } from "@/app/lib/seed";

async function seedAllTrails() {
  // await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS allTrails (
  //     id INT PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     area VARCHAR(255) NOT NULL,
  //     difficulty VARCHAR(12) NOT NULL,
  //     length DECIMAL NOT NULL,
  //     elevation INT,
  //     type VARCHAR(20),
  //     link VARCHAR(255)
  //   );
  // `;

  const insertedTrails = await Promise.all(
    allTrails.map(async (trail) => {
      return supabase
        .from("allTrails")
        .insert({
          id: trail.id,
          name: trail.name,
          area: trail.area,
          difficulty: trail.difficulty,
          length: trail.length,
          elevation: trail.elevation,
          type: trail.type,
          link: trail.link,
        })
        // .onConflict("id"); // Prevents insertion if id already exists
    })
  );
  return insertedTrails;
}

export async function GET() {
  try {
    const insertedTrails = await seedAllTrails();
    return Response.json({ message: 'Database seeded successfully', insertedTrails });
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}