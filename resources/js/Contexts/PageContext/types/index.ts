export type SidebarType = 'mobile' | 'desktop';

export type TPageContext = {
  sideBarOpened: boolean
  openSideBar: (sidebar?: SidebarType) => void
  closeSideBar: (sidebar?: SidebarType) => void
}
