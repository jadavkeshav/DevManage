import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App';
import { CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { userAuth, loading } = useContext(UserContext);


  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!userAuth.token) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;