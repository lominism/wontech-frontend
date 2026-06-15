import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  return (
    <header className="flex p-3 justify-between h-15 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        {/* <BreadcrumbSlot params={{ all: pathSegments }} /> */}
      </div>
    </header>
  );
};

export default Header;
