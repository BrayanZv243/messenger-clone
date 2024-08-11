import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar, {
    DesktopSidebarSkeleton,
} from "./DesktopView/DesktopSidebar";
import MobileFooter, { MobileFooterSkeleton } from "./MobileView/MobileFooter";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function Sidebar({ children }: { children: React.ReactNode }) {
    const currentUser = await getCurrentUser();
    await delay(8000);
    return (
        <div className="h-full">
            <DesktopSidebar currentUser={currentUser!} />
            <MobileFooter currentUser={currentUser!} />
            <main className="lg:pl-20 h-full">{children}</main>
        </div>
    );
}

export const SidebarSkeleton = () => {
    return (
        <aside className="h-full">
            <DesktopSidebarSkeleton />
            <MobileFooterSkeleton />
        </aside>
    );
};

export default Sidebar;
