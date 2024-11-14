export const defaultTrail = 
  {
    id: 1,
    trail_name: 'Triple Falls Trail',
    area_name: 'DuPont State Recreational Forest',
    difficulty_rating: 'moderate',
    length: 2.7,
    elevation_gain: 393,
    route_type: 'loop',
    trail_link: 'https://www.alltrails.com/trail/us/north-carolina/triple-falls-trail'
  };

export const defaultUser = 
  {
    id: 1,
    email: "demo@gmail.com",
    password: "1234",
    user_name: "Demo User",
    avatar: "/newUser.png",
    bio: "Bio text goes here ... Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem reprehenderit assumenda quibusdam iste eos exercitationem molestias nulla fuga repellat incidunt ullam cupiditate necessitatibus quidem debitis dolorum nesciunt labore quos, laboriosam tempora qui tempore quo velit! Libero quod eligendi at eum.",
    user_hikes: ["1", "2"]
  };

export const defaultHike = 
  {
    id: 1,
    creator_id: 1,
    trail_id: 1,
    title: "Sample Hike - Mid-week Morning Hike - Triple Falls",
    date: "2024-11-28",
    time: "10:00",
    location: "Triple Falls Parking Lot",
    comments: "Meet me by the blue CR-V. No dogs allowed. We will go slow and have time to take a lot of pictures.",
    status: "new"
  };