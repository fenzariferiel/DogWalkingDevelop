import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import timePic from '../media/clock.png';
import '../styles/booking.css';

function BookingPage() {
  const { username } = useParams();
  const { user } = useAuthContext();
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const navigate = useNavigate();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };


  useEffect(() => {
    fetch(`/api/user/owner/${user.username}`)
      .then((response) =>{
        if (response.ok){
            
            setOwnerName(user.username);
            return response.json();
        } 
        else {       
              navigate("/");
        }
      }) ;
  }, [user.username]);

  useEffect(() => {
    fetch(`/api/segments/fromUser/${username}`)
      .then((response) => response.json())
      .then((data) => setSegments(data.filter((s) => s.status !== "booked")));
  }, [username]);

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
  };

  const handleBookingSubmit = () => {



    if (!selectedSegment) {
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
        status: "requested",
      }),
    })
      .then((response) => {
        // no need to delete the segment after booking

        if(response.ok){

          alert("Booking request sent to "+username);
          navigate("/");

        /*fetch(`/api/segments/${selectedSegment._id}`, {
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
            .catch((error) => console.error(error));*/
        }
        return response.json() 
      
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="pageContainer">
      <div className="bookingContainer">
        <h2>Book {username} !</h2>
        <h3>Please choose your preferred time</h3>
        <ul className="segmentList">
          {segments.map((segment) => (
            <li
              key={segment._id}
              onClick={() => handleSegmentClick(segment)}
              className="segmentItem"
              style={{
                backgroundColor:
                  selectedSegment?._id === segment._id ? "#add8e6" : null,
              }}
            >
              <img src={timePic} alt="Time icon" className="timeIcon"/>
              {new Date(segment.start).toLocaleString('en-US', options)} -{" "}
              {new Date(segment.start).toLocaleString('en-US', options)}
            </li>
          ))}
        </ul>
        <button 
        //if there are no segments, disable the button
        disabled={segments.length === 0}
        onClick={handleBookingSubmit}
        className="requestButton"
        >
          Send Request
        </button>
      </div>
    </div>
  );
}

export default BookingPage; 