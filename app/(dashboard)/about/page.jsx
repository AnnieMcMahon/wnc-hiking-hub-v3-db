"use client";

export default function About() {
  return (
    <div id="about" className="text-box text-left">
      <h1>About WNC Hiking Hub</h1>
      <p>
        WNC Hiking Hub&apos;s mission is to
        <strong> connect outdoor enthusiasts</strong> in Western North Carolina
        who want to explore the beauty of the region while enjoying the company
        of like-minded adventurers.
        <br /><br />
        The idea for this app arose when Meetup drastically increased its fees,
        forcing many small hiking groups to shut down. WNC Hiking Hub aims to
        provide a <strong>free and community-focused alternative</strong> to
        help hikers connect and organize adventures together.
      </p>

      <h2>Upcoming Features</h2>
      <ul>
        <li>Set a maximum participant limit for posted hikes</li>
        <li>Comment on hikes posted or joined</li>
        <li>Access other users&apos; profiles</li>
        <li>Optimize the app for mobile and tablet screens</li>
      </ul>

      <h2>Long-Term Features</h2>
      <p>
        <strong>Premium Membership:</strong> Introduce a paid membership option
        and reserve some of the features below for premium users.
      </p>
      <ul>
        <li>
          Earn levels and badges based on hike attendance and display them on
          user bio
        </li>
        <li>Connect with other users via in-app messaging or Slack</li>
        <li>Opt in for updates on new hikes, changes, or cancellations</li>
        <li>Integrate AllTrails API (if available)</li>
        <li>
          Participate in challenges (e.g., earn a badge by hiking to 10
          waterfalls)
        </li>
        <li>
          Organize specialized groups (e.g., women-only, waterfall enthusiasts)
        </li>
        <li>
          Earn leader certifications by completing a certain number of hikes
        </li>
      </ul>

      <h2>Technology Used</h2>
      <ul>
        <li>
          <strong>Frontend:</strong> CSS, JavaScript, React, Next.js
        </li>
        <li>
          <strong>Backend:</strong> Supabase, SQL
        </li>
        <li>
          <strong>Testing:</strong> Jest, React Testing Library
        </li>
      </ul>

      <h2>Collaboration / Beta Testing</h2>
      <p>Reach out if you would like to:</p>
      <ul>
        <li>Collaborate on any of the upcoming features</li>
        <li>Beta test the app</li>
        <li>Review the code and share your feedback</li>
      </ul>

      <h2>Connect With Me</h2>
      <ul>
        <li>
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/anniemcmahon20/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.linkedin.com/in/anniemcmahon20
          </a>
        </li>
        <li>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/AnnieMcMahon"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/AnnieMcMahon
          </a>
        </li>
        <li>
          <strong>E-mail:</strong> <a href="mailto:anniemcmahon20@gmail.com">anniemcmahon20@gmail.com</a>
        </li>
      </ul>
    </div>
  );
};
