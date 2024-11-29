import {Outlet} from "react-router-dom";
import '@fontsource-variable/dm-sans';
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/AppSideBar.tsx";
import { Toaster } from "@/components/ui/toaster";
import Breadcrumb from "@/components/Breadcrumb";
import "@fontsource-variable/inter"


export const DashBoardLayout = () => {
    return (
        <div className={`flex h-screen`} style={{fontFamily: "Inter Variable"}}>
            <SidebarProvider>
                <div className={`grid grid-cols-[auto,1fr] w-full`}>
                    <AppSidebar/>
                    <main className={`flex flex-col h-screen overflow-auto`}>
                        <div className="flex items-center p-4">
                            <SidebarTrigger/>
                            <div className="mx-4 border-l border-gray-300 h-6" />
                            <Breadcrumb/>
                        </div>
                        <div className="border-t border-gray-300 mt-3" />
                        <Toaster />
                        <Outlet/>
                    </main>
                </div>
            </SidebarProvider></div>
    )
}