import React, { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import routes from '../../routes';
import DynamicBreadcrumb from '../../utils/breadcrumb';

const Appcontent = () => {
    const location = useLocation();
    const currentRoute = routes.find(route => route.path === location.pathname);
  return (
    <Container maxWidth="lg" className="px-4"   sx={{ margin: 0, padding: 0 }}>
        <DynamicBreadcrumb pageTitle={currentRoute.name}/>
      <Suspense fallback={<CircularProgress color="primary" />}>
        <Routes>
          {routes.map((route, idx) => (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                element={<route.element />}
              />
            )
          ))}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </Container>
  );
};

export default React.memo(Appcontent);
