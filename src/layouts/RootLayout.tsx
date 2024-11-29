//import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";
//import {Footer} from "@/components/Footer.tsx";
import "@fontsource-variable/dm-sans"
import "@fontsource-variable/inter"

export const RootLayout = () => {
    return <div style={{fontFamily: "Inter Variable"}}>
        <Outlet />
    </div>
}