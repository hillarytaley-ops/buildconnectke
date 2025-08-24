
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Materials = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to suppliers page since materials are now part of supplies
    navigate('/suppliers', { replace: true });
  }, [navigate]);
  return null; // This will redirect automatically
};

export default Materials;
