import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function BookingPage() {
  const { username } = useParams();
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    fetch(`/api/segments/fromUser/${username}`)
      .then((response) => response.json())
      .then((data) => setSegments(data));
  }, [username]);

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
  };

  const handleBookingSubmit = () => {
    if (!selectedSegment || !ownerName) {
      alert("Please select a segment and enter your name.");
      return;
    }

    fetch("/api/bookings/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walker: username,
        owner: ownerName,
        seg_id: selectedSegment._id,
      }),
    })
      .then((response) => {
        if(response.ok){
          fetch(`/api/segments/${selectedSegment._id}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                //save this for later
                //updates the segments state to remove the segment that was just booked
                setSegments((prevSegments) =>
                  prevSegments.filter((segment) => segment._id !== selectedSegment._id)
                );
                setSelectedSegment(null);
              }
              
              return response.json()})
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
        }
        return response.json()})
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Booking Page for {username}</h1>
      <h2>Select a Segment:</h2>
      <ul>
        {segments.map((segment) => (
          <li
            key={segment._id}
            onClick={() => handleSegmentClick(segment)}
            style={{
              backgroundColor:
                selectedSegment?._id === segment._id ? "lightblue" : "white",
            }}
          >
            {new Date(segment.start).toLocaleDateString()} -{" "}
            {new Date(segment.end).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h2>Enter Your Name:</h2>
      <input
        type="text"
        value={ownerName}
        onChange={(event) => setOwnerName(event.target.value)}
      />
      <button onClick={handleBookingSubmit}>Send Request</button>
    </div>
  );
}

export default BookingPage;