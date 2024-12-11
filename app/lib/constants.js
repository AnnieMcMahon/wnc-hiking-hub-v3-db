//TRAIL SEARCH CRITERIA
export const ANY_AREA = "Anywhere in WNC";
export const ANY_DIFFICULTY = "Any difficulty";
export const ANY_LENGTH = "Any length";

export const SHORT = "Shorter than 3 miles";
export const MEDIUM = "From 3 to 6 miles";
export const LONG = "Longer than 6 miles";

export const AREAS = [
  "Bent Creek Experimental Forest",
  "Blue Ridge Parkway",
  "DuPont State Recreational Forest",
  "Gorges State Park",
  "North Carolina Arboretum",
  "Pisgah National Forest",
  "Other (not listed)"
];

export const DIFFICULTIES = [
  "easy",
  "moderate",
  "hard"
]

export const LENGTHS = [
  SHORT,
  MEDIUM,
  LONG
];

export const ROUTE_TYPES = [
  "loop",
  "out-and-back",
  "point-to-point"
];

//BIO INFO
export const DEFAULT_USER_NAME = "New User";
export const DEFAULT_AVATAR = "/newUser.png";
export const DEFAULT_BIO = "Tell us about yourself";

//DEFAULT USER WHEN NO ONE IS SIGNED IN
export const DEFAULT_USER = {
  id: 1,
  email: "demo@gmail.com",
  user_name: "Demo User",
  avatar: "/newUser.png",
  bio: "Bio text goes here ... Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem reprehenderit assumenda quibusdam iste eos exercitationem molestias nulla fuga repellat incidunt ullam cupiditate necessitatibus quidem debitis dolorum nesciunt labore quos, laboriosam tempora qui tempore quo velit! Libero quod eligendi at eum.",
};

export const BLANK_USER = {
  id: 0,
  email: "",
  user_name: "New User",
  avatar: "/newUser.png",
  bio: "Tell us about yourself"
};

export const BLANK_BIO = {
  user_name: "",
  bio: ""
};

export const BLANK_HIKE = {
  id: 0,
  title: "",
  date: "",
  time: "",
  location: "",
  comments: "",
  creator_id: 0,
  status: ""
};

export const BLANK_HIKE_INFO = {
  id: 0,
  title: "",
  date: "",
  time: "",
  location: "",
  comments: "",
  status: "",
  creator_id: 0,
  creator: "",
  buttonMessage: ""
};

export const BLANK_TRAIL = {
  id: 0,
  trail_name: "",
  area_name: "",
  difficulty_rating: "",
  length: 0,
  elevation_gain: 0,
  route_type: "",
  trail_link: ""
};

export const MOCK_TRAIL_INFO = {
  id: 5,
  trail_name: "Blue Ridge Trail",
  area_name: "Blue Ridge Mountains",
  difficulty_rating: "moderate",
  length: 5.4,
  elevation_gain: 1200,
  route_type: "loop",
  trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
};

export const MOCK_HIKE_INFO = {
  id: 5,
  title: "Sunset Hike",
  date: "Wed, 12/01/2024",
  time: "6:00 PM",
  location: "Blue Ridge Parkway",
  comments: "Bring water and snacks.",
  status: "new",
  creator_id: 1,
  creator: "Annie McMahon",
  buttonMessage: "Join Hike"
};

export const MOCK_HIKE = {
  id: 5,
  title: "Sunset Hike",
  date: "2024-12-01",
  time: "18:00",
  location: "Blue Ridge Parkway",
  comments: "Bring water and snacks.",
  status: "new",
  creator_id: 1
};

export const MOCK_BIO_INFO = {
  user_name: "Hiker 123",
  bio: "Hello World",
};

export const MOCK_USER = {
  id: 2,
  email: "casualhiker@gmail.com",
  user_name: "Test User",
  avatar: "/newUser.png",
  bio: "Hello everyone!"
};



