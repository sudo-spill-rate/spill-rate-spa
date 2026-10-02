// src/routes/Routes.auth.tsx
import React from "react";
import OAuthCallbackPage from "../pages/SignInPages/OAuthCallBack/OAuthCallbackPage";
import SignInPage from "../pages/SignInPages/SignIn/SignInPage";

export const AuthRoutes = [
    {
        key: "/login",
        path: "/login",
        element: <SignInPage />,
    },
    {
        key: "/oauth/callback",
        path: "/oauth/callback",
        element: <OAuthCallbackPage />,
    },
];

export default AuthRoutes;