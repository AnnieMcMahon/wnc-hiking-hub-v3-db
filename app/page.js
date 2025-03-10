export default function Home() {
  return (
    <div id="home" className="text-box w-[95%] md:w-120 my-4 mx-auto py-4 px-1 md:px-8 leading-8">
        <h1>How to Use This Site</h1>
        <ul className="m-0 md:m-2">
          <li>Create a free account using the <b>Log In / Sign Up</b> button</li>
          <li>Edit your <b>Bio</b> page and add a picture and description</li>
          <li><b>Post a hike</b> you would like others to explore with you</li>
          <li><b>Join a hike</b> someone else posted</li>
          <li>Go to your <b>Bio</b> page to view or edit your hikes</li>
          <p className="text-center mt-2">Happy hiking!</p>
        </ul>
    </div>
  );
};