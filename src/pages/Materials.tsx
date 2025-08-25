
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Materials = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to suppliers page with materials tab active
    navigate('/suppliers?tab=materials', { replace: true });
  }, [navigate]);
  return null; // This will redirect automatically
};

export default Materials;
