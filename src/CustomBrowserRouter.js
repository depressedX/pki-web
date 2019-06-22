import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

export const RouterContext = React.createContext({});

export const CustomBrowserRouter = ({ children }) => (
    <BrowserRouter>
        <Route>
            {(routeProps) => (
                <RouterContext.Provider value={routeProps}>
                    {children}
                </RouterContext.Provider>
            )}
        </Route>
    </BrowserRouter>
);
export function useRouter() {
    return React.useContext(RouterContext)
}