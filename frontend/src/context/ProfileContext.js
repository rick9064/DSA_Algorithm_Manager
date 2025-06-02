// src/context/ProfileContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [firstName, setFirstName] = useState(localStorage.getItem('first_name') || 'User');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profile_photo') || 'https://i.pravatar.cc/100?u=r');

  useEffect(() => {
    localStorage.setItem('first_name', firstName);
  }, [firstName]);

  useEffect(() => {
    localStorage.setItem('profile_photo', profilePhoto);
  }, [profilePhoto]);

  return (
    <ProfileContext.Provider value={{ firstName, setFirstName, profilePhoto, setProfilePhoto }}>
      {children}
    </ProfileContext.Provider>
  );
};
