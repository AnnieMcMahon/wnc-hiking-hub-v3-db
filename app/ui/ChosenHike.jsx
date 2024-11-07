"use client";

function ChosenHike({ hikeSelected }) {
  if (hikeSelected) {
    return (
      <div>
        <div id="chosen-hike" className="hike">
          <h4>{hikeSelected.name}</h4>
          <p>{hikeSelected.area}</p>
          <p>
            {hikeSelected.difficulty} * {hikeSelected.length} mi *{" "}
            {hikeSelected.elevation} ft * {hikeSelected.type}
          </p>
          <a
            href={hikeSelected.link}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            All Trails Link
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="hike" id="chosen-hike-placeholder">
        <h2>Choose a trail</h2>
        </div>
      </div>
    );
  }
}

export default ChosenHike;
