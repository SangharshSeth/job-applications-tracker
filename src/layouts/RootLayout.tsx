//import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";
//import {Footer} from "@/components/Footer.tsx";
import "@fontsource-variable/dm-sans"

export const RootLayout = () => {
    return <div style={{fontFamily: "DM Sans Variable"}}>
        <Outlet />
    </div>
}