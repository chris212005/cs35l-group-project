import './Messaging.css'
import { Link } from "react-router-dom";
import React, { useState } from 'react';

export default function Messaging() {

  const [people, setPeople] = useState([
    { name: 'shaun',  key: '1' },
    { name: 'yoshi',  key: '2' },
    { name: 'mario',  key: '3' },
    { name: 'luigi',  key: '4' },
    { name: 'peach',  key: '5' },
    { name: 'toad',   key: '6' },
    { name: 'bowser', key: '7' },
    { name: 'jerry', key: '7' },
    { name: 'srijesh', key: '7' },
    { name: 'josh', key: '7' },
    { name: 'gabriel', key: '7' },
  ]);
  

  return (
    <div className="messagingContainer">
      <div className="messagingHeader">
        <h1 className="messageTitle">Messages</h1>
        <div className="nameIconContainer">
          <h1 className="userIcon">!</h1>
          <h1 className="messageName">USERNAME</h1>
        </div>
      </div>

      <div className="sideBar">
          { people.map(person => (
            <div key={person.key}>
              <p>{person.name}</p>
            </div>
          ))}
      </div>

    <Link to="/">
      <button>Go to Profile</button>
    </Link>
  </div>
  )
}