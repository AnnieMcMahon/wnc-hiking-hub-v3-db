//TRAIL SEARCH CRITERIA
export const ANY_AREA = "Anywhere in WNC";
export const ANY_DIFFICULTY = "Any difficulty";
export const ANY_LENGTH = "Any length";

export const SHORT = "Shorter than 3 miles";
export const MEDIUM = "From 3 to 6 miles";
export const LONG = "Longer than 6 miles";

export const AREAS = [
  "DuPont State Recreational Forest",
  "Pisgah National Forest",
  "North Carolina Arboretum",
  "Nantahala Forest",
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
