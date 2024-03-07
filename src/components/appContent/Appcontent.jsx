// import React, { Suspense } from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import CircularProgress from '@mui/material/CircularProgress';
// import Container from '@mui/material/Container';
// import routes from '../routes';

// const Appcontent = () => {
//   return (
//     <Container maxWidth="lg" className="px-4">
//       <Suspense fallback={<CircularProgress color="primary" />}>
//         <Routes>
//           {routes.map((route, idx) => (
//             route.element && (
//               <Route
//                 key={idx}
//                 path={route.path}
//                 exact={route.exact}
//                 element={<route.element />}
//               />
//             )
//           ))}
//           <Route path="/" element={<Navigate to="dashboard" replace />} />
//         </Routes>
//       </Suspense>
//     </Container>
//   );
// };

// export default React.memo(Appcontent);
