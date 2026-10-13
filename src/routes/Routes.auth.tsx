// src/routes/Routes.auth.tsx
import React from "react";
import OAuthCallbackPage from "../pages/SignInPages/OAuthCallBack/OAuthCallbackPage";

export const AuthRoutes = [
    {
        key: "/oauth/callback",
        path: "/oauth/callback",
        element: <OAuthCallbackPage />,
    },
];

export default AuthRoutes;