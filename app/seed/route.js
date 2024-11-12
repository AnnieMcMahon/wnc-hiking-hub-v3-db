/* Once the code to seed the database is ready, navigate to "/seed" to run the code. Only needs to run once, then delete (or comment out) this file. Need to work on the code to create the table (copy/paste from a tutorial, doesn't work) */

import { supabase } from "@/app/api/initSupabase";
import { sampleAppUsers } from "@/app/lib/seed";

async function seedUsers() {
  const insertedUsers = await Promise.all(
    sampleAppUsers.map(async (user) => {
      return supabase
        .from("users")
        .insert({
          email: user.email,
          password: user.password,
          user_name: user.user_name,
          avatar: user.avatar,
          bio: user.bio,
          user_hikes: user.user_hikes
        })
    })
  );
  return insertedUsers;
}

export async function GET() {
  try {
    const insertedUsers = await seedUsers();
    return Response.json({ message: 'Database seeded successfully', insertedUsers });
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 