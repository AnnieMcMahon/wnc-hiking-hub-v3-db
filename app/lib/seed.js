const allTrails = [
  {
    id: 1,
    name: 'Triple Falls Trail',
    area: 'DuPont State Recreational Forest',
    difficulty: 'Moderate',
    length: 2.7,
    elevation: 393,
    type: 'Loop',
    link: 'https://www.alltrails.com/trail/us/north-carolina/triple-falls-trail'
  },
  {
    id: 2,
    name: 'Hard Times Loop',
    area: 'Pisgah National Forest',
    difficulty: 'Moderate',
    length: 6.4,
    elevation: 531,
    type: 'Loop',
    link: 'https://www.alltrails.com/trail/us/north-carolina/hardtimes-loop'
  },
  {
    id: 3,
    name: 'Lake Powhatan via Bent Creek Trail',
    area: 'North Carolina Arboretum',
    difficulty: 'Easy',
    length: 5.5,
    elevation: 196,
    type: 'Out & back',
    link: 'https://www.alltrails.com/trail/us/north-carolina/lake-powhatan-loop-via-bent-creek-trail'
  },
  {
    id: 4,
    name: 'Owl Ridge Trail',
    area: 'North Carolina Arboretum',
    difficulty: 'Moderate',
    length: 5.4,
    elevation: 403,
    type: 'Loop',
    link: 'https://www.alltrails.com/trail/us/north-carolina/owl-ridge-trail'
  },
  {
    id: 5,
    name: 'Fletcher Loop',
    area: 'Bill Moore Community Park',
    difficulty: 'Easy',
    length: 3.1,
    elevation: 22,
    type: 'Loop',
    link: 'https://www.alltrails.com/explore/trail/us/north-carolina/fletcher-park-loop'
  },
  {
    id: 6,
    name: 'Looking Glass Rock Trail',
    area: 'Pisgah National Forest',
    difficulty: 'Moderate',
    length: 6.1,
    elevation: 1683,
    type: 'Out & back',
    link: 'https://www.alltrails.com/trail/us/north-carolina/looking-glass-rock-trail'
  },
];

const sampleAppUsers = [
  {
    id: 1,
    email: "demo@gmail.com",
    password: "1234",
    name: "Demo User",
    avatar: "/newUser.png",
    bio: "Bio text goes here ... Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem reprehenderit assumenda quibusdam iste eos exercitationem molestias nulla fuga repellat incidunt ullam cupiditate necessitatibus quidem debitis dolorum nesciunt labore quos, laboriosam tempora qui tempore quo velit! Libero quod eligendi at eum.",
    hikes: [1, 2, 3, 5, 6]
  },
  {
    id: 2,
    email: "anniemcmahon20@gmail.com",
    password: "1234",
    name: "Annie McMahon",
    avatar: "/avatar1.png",
    bio: "I've been hiking regularly for about five years now. I enjoy moderate hikes in a wooded area, with nice views or waterfalls, preferagly. My pace is about 2.5-3 mph. Join me on my next hike!",
    hikes: [2, 3, 4]
  },
];

const sampleHikes = [
  {
    id: 1,
    creator: 1,
    allTrailsId: 1,
    title: "Mid-week Morning Hike - Triple Falls",
    date: "2024-10-25",
    time: "10:00",
    location: "Triple Falls Parking Lot",
    comments: "Meet me by the blue CR-V. No dogs allowed. We will go slow and have time to take a lot of pictures."
  },
  {
    id: 2,
    creator: 2,
    allTrailsId: 2,
    title: "Afternoon Hike - Hard Times Loop",
    date: "2024-11-01",
    time: "14:00",
    location: "Hardtimes Rd, Asheville",
    comments: "Bring your dog! Limit 12 people. The trail is not as hard as the name indicates, don't worry! I'll be wearing a red jacket."
  },
  {
    id: 3,
    creator: 1,
    allTrailsId: 6,
    title: "Lake Powhatan via Bent Creek Trail",
    date: "2024-09-04",
    time: "09:00",
    location: "Arboretum hiking parking lot (left after the gate)",
    comments: "Be on time, we're leaving exactly at 9. We should be back before lunch, but bring a snack and plenty of water. We'll be taking a break midway."
  },
  {
    id: 4,
    creator: 2,
    allTrailsId: 4,
    title: "Owl Ridge Trail - laidback hike for everyone",
    date: "2026-09-21",
    time: "11:00",
    location: "NC Arboretum hiker's parking lot",
    comments: "This is a pretty easy hike. We can hang out at the arboretum's bistro afterwards."
  },
  {
    id: 5,
    creator: 1,
    allTrailsId: 5,
    title: "Fletcher Loop Fitness Hike",
    date: "2026-09-27",
    time: "15:00",
    location: "Bill Moore Community Park, near the dog park",
    comments: "This is a fitness hike. Only sign up if you can go 3 mph or faster. We will not wait for stragglers. You've been warned! Also, no dogs."
  },
  {
    id: 6,
    creator: 1,
    allTrailsId: 2,
    title: "Hard Times Loop",
    date: "2026-09-27",
    time: "10:00",
    location: "Hardtimes Rd",
    comments: "Bring  your lunch, plenty of water, and your dog, if you have one. See you on the trail!"
  },
];

export { allTrails, sampleAppUsers, sampleHikes };