import { Link } from 'react-router-dom';
import { AppRouteEnum } from '../internal/enums/app-route-enum.tsx';

export function NotFoundPage(): React.JSX.Element {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      textAlign: 'center',
      padding: '16px'
    }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          404
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '32px' }}>
          Oops! The page you are looking for does not exist.
      </p>

      <Link
        to={AppRouteEnum.MainPage}
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          backgroundColor: '#6366f1',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
          Back to Home
      </Link>
    </div>
  );
}
