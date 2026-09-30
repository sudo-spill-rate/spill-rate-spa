// import { Routes as ReactRoutes, Route, Navigate, Outlet } from "react-router";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { AuthRoutes } from "./routes/Routes.auth";
// import { StudentRoutes } from "./routes/Routes.student";
// import { SpaceRoutes } from "./routes/Routes.space";
// import { AdminDataRoutes } from "./routes/Routes.admin.tsx";
// // import { AdminRoutes } from "./routes/Routes.admin";
// import { ProfRoutes } from "./routes/Routes.professor.tsx";
// import PageNotFound from "./pages/PageNotFound/pageNotFound.jsx";

// import { UserProvider } from "./contexts/user/userContextProvider.tsx";
// import { SpaceProvider } from "./contexts/space/spaceContextProvider.tsx";
// import { SpaceThemeProvider } from "./contexts/theme/spaceThemeContextProvider.tsx";
// import { NotificationProvider } from "./contexts/notification/notificationContextProvider.tsx";

// import LandingPage from "./pages/Landing/landingPage.jsx";
// // import PrivacyPolicy from "./pages/Legal/PrivacyPolicy.jsx";
// import TermsAndConditions from "./pages/Legal/TermsAndConditions.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import NotificationContainer from "./components/Notification/NotificationContainer.jsx";
// import { AdminProvider } from "./contexts/admin/adminContextProvider.tsx";
// import { PrivacyPolicy } from "./pages/Legal/PrivacyPolicy.jsx";
// // import NotificationExample from "./examples/NotificationExample.jsx";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//     },
//   },
// });

// export default function Routes() {
//   return (
//     <NotificationProvider>
//       <QueryClientProvider client={queryClient}>
//         <UserProvider>
//           <SpaceThemeProvider>
//             <ReactRoutes>
//               <Route key="landing" path="/" element={<LandingPage />} />
//               <Route key="privacy" path="/privacy-policy" element={<PrivacyPolicy />} />
//               <Route key="terms" path="/terms" element={<TermsAndConditions />} />
//               {AuthRoutes.map((route) => (
//                 <Route key={route.key} path={route.path} element={route.element} />
//               ))}
//               {StudentRoutes.map((route) => (
//               <Route
//                 key={route?.key || 'student-route'}
//                 path={route?.path || ''}
//                 element={
//                   <SpaceProvider>
//                     <ProtectedRoute>{route?.element}</ProtectedRoute>
//                   </SpaceProvider>
//                 }
//               />
//             ))}
//             {SpaceRoutes.map((route) => (
//               <Route
//                 key={route?.key || 'space-route'}
//                 path={route?.path || ''}
//                 element={
//                   <SpaceProvider>
//                     <ProtectedRoute>{route?.element}</ProtectedRoute>
//                   </SpaceProvider>
//                 }
//               />
//             ))}
//             <Route
//               path="/prof/*"
//               element={
//                 <SpaceProvider>
//                   <ProtectedRoute>
//                     <ProfRoutes />
//                   </ProtectedRoute>
//                 </SpaceProvider>
//               }
//             />
//             <Route path="/teacher" element={<Navigate to="/prof/home" replace />} />
//             <Route path="/teacher/*" element={<Navigate to="/prof/home" replace />} />
//             <Route path="/student" element={<Navigate to="/home" replace />} />
//             <Route path="/student/*" element={<Navigate to="/home" replace />} />
//             <Route
//               element={
//                 <AdminProvider>
//                   <Outlet />
//                 </AdminProvider>
//               }
//             >
//               {AdminDataRoutes.map((route) => (
//                 <Route
//                   key={route.key}
//                   path={route.path}
//                   element={route.element}
//                 />
//               ))}
//             </Route>
//             {/* Fallback */}
//             <Route path="*" element={<PageNotFound />} />
//           </ReactRoutes>
//         </SpaceThemeProvider>
//       </UserProvider>

//       {/* Global Notification Container */}
//       <NotificationContainer />
//     </QueryClientProvider>
//   </NotificationProvider>
// );
// }