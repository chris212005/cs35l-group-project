import './Profile.css'
import { Link } from "react-router-dom";

export default function Profile() {

  return (
    <>
    <div>
    <h1>Profile Page</h1>

    <Link to="/messaging">
      <button>Go to Messaging</button>
    </Link>
  </div>
    </>
  )
}
