"use client";
import Link from "next/link";

export default function About() {
  return (
    <div id="about" className="text-box w-[95%] md:w-[60%] text-left">
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
      <br/>

      <h2>Upcoming Features</h2>
      <p>
        The app is currently in beta-testing stage. Based on the feedback received, I will decide which additional features to add. Here are some features I have in mind:
      </p>
      <br/>
      <ul>
        <p className="font-bold">General Features:</p>
        <li>
          Introduce a paid membership option and reserve some of the participant features below for premium users
        </li>
        <li>Create a mobile app version people can download on their device</li>
        <li>Integrate AllTrails API (if it becomes available)</li>
        <br/>
        <p className="font-bold">Participant Features:</p>
        <li>
          Earn levels and badges based on hike attendance and display them on user bio
        </li>
        <li>Connect with other users via in-app messaging or Slack</li>
        <li>Opt in for updates on new hikes, changes, or cancellations</li>
        <li>
          Participate in challenges (like earning a badge by hiking to 10
          waterfalls)
        </li>
        <li>
          Organize specialized groups (like women-only, waterfall enthusiasts)
        </li>
        <li>
          Earn leader certifications by completing a certain number of hikes
        </li>
      </ul>
      <br/>
      <h2>Collaboration / Beta Testing</h2>
      <p><Link 
            href="mailto:annie@amwebstudio.net"
            className="underline"
            >
            Send me an e-mail
          </Link> or join the <Link 
            href="https://amwebstudio.slack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            AM Web Studio slack channel
          </Link> if you would like to:</p>
      <ul>
        <li>Collaborate on any of the upcoming features</li>
        <li>Beta test the app</li>
        <li>Review the code and share your feedback</li>
      </ul>
      <br/>
      <br/>
      <h2>Collaborators</h2>
      <p>This app was developed by Annie McMahon, with contributions from:</p>
      <ul>
        <li>
        <Link 
            href="https://github.com/tbmeans"
            target="_blank"
            >
            Tim Means
          </Link>
        </li>
        <li>
        <Link 
            href="https://github.com/vazquezea96s"
            target="_blank"
            >
            Eduardo Vazquez
          </Link>
        </li>
        <li>
        <Link 
            href="https://github.com/ketansahugit"
            target="_blank"
            >
            Ketan Sahu
          </Link>
        </li>
      </ul>
      <br/>

      <h2>Technology Used</h2>
      <ul>
        <li>
          <strong>Frontend:</strong> CSS, JavaScript, React, Next.js, Tailwind, ShadCN
        </li>
        <li>
          <strong>Backend:</strong> Supabase, SQL
        </li>
        <li>
          <strong>Testing:</strong> Jest, React Testing Library
        </li>
      </ul>
      <br/>
      <h2>Connect With Me</h2>
      <ul>
      <li>
          <strong>Website:</strong>{" "}
          <Link
            href="https://amwebstudio.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            amwebstudio.net
          </Link>
        </li>
        <li>
          <strong>LinkedIn:</strong>{" "}
          <Link
            href="https://www.linkedin.com/in/anniemcmahon20"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/anniemcmahon20
          </Link>
        </li>
        <li>
          <strong>GitHub:</strong>{" "}
          <Link
            href="https://github.com/AnnieMcMahon"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/AnnieMcMahon
          </Link>
        </li>
        <li>
          <strong>Slack:</strong>{" "}
          <Link 
            href="https://amwebstudio.slack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            amwebstudio.slack.com
          </Link>
        </li>
        <li>
          <strong>E-mail:</strong>{" "}
          <Link 
            href="mailto:annie@amwebstudio.net"
            >
            Send me an e-mail
          </Link>
        </li>
      </ul>
    </div>
  );
};
