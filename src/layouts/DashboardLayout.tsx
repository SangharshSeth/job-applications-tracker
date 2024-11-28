import {Outlet} from "react-router-dom";
import '@fontsource-variable/dm-sans';
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/AppSideBar.tsx";
import { Toaster } from "@/components/ui/toaster";

export const DashBoardLayout = () => {
    return (
        <div className={`flex h-screen`} style={{fontFamily: "DM Sans Variable"}}>
            <SidebarProvider>
                <div className={`grid grid-cols-[auto,1fr] w-full`}>
                    <AppSidebar/>
                    <main className={`flex flex-col h-screen overflow-auto`}>
                    <Toaster />
                        <SidebarTrigger/>
                        <Outlet/>
                    </main>
                </div>
            </SidebarProvider></div>
    )
}