import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      API.get('users/me/')
        .then(res => setProfile(res.data))
        .catch(err => console.log(err));
    }
  }, [user]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>Profile</h1>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      {/* Add more fields if needed */}
    </div>
  );
};

export default Profile;