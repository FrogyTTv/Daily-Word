import dashboardIcon from "../assets/icons/icon-dashboard.svg";
import bookmarkIcon from "../assets/icons/icon-bookmark.svg";
import libraryIcon from "../assets/icons/icon-library.svg";
import statsIcon from "../assets/icons/icon-stats.svg";
import supportIcon from "../assets/icons/icon-support.svg";
import settingsIcon from "../assets/icons/icon-settings.svg";

type NavItem = {
  page: string;
  label: string;
  icon: string;
};

type NavGroup = {
  heading: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "General",
    items: [
      { page: "dashboard", label: "Dashboard", icon: dashboardIcon },
      { page: "notes", label: "Notes & Highlights", icon: bookmarkIcon },
      { page: "registration", label: "Register Chapters", icon: libraryIcon },
    ],
  },
  {
    heading: "Profile",
    items: [
      { page: "analytics", label: "Progress Analytics", icon: statsIcon },
      { page: "support", label: "Support", icon: supportIcon },
      { page: "settings", label: "Settings", icon: settingsIcon },
    ],
  },
];

type NavbarProps = {
  currentPage: string;
  updatePage: (page: string) => void;
};

export const Navbar = ({ currentPage, updatePage }: NavbarProps) => {
  return (
    <div className="navigation-group">
      {NAV_GROUPS.map(({ heading, items }) => (
        <div key={heading}>
          <h5>{heading}</h5>
          <ul>
            {items.map(({ page, label, icon }) => (
              <li key={page} >
                <button className={currentPage === page ? "nav-active nav-button" : "nav-button"} onClick={() => updatePage(page)}>
                  <img style={{ width: 15 }} src={icon} alt={label.toLowerCase().replace(/\s+/g, "-")} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};



// import dashboardIcon from "../assets/icons/icon-dashboard.svg";
// import bookmarkIcon from "../assets/icons/icon-bookmark.svg";
// import libraryIcon from "../assets/icons/icon-library.svg";
// import statsIcon from "../assets/icons/icon-stats.svg";
// import supportIcon from "../assets/icons/icon-support.svg";
// import settingsIcon from "../assets/icons/icon-settings.svg";


// const NavbarItem = ({imgSrc, desc, link, isActive}: any) => {
//   return(
//     <>
//       <li className={isActive? 'nav-active' : ''}>
//         <button className="nav-button" onClick={() => link()}>
//           <img style={{ width: 15}} src={imgSrc} alt={desc.toLowerCase().replace(/\s+/g, '-')} />
//           {desc}
//         </button>
//       </li>
//     </>
//   )
// }

// export const Navbar = ({ currentPage, updatePage }: any) => {
//   const sendToLink = ( link: string) => {
//     updatePage(link)
//   }
//   return (
//     <>
//       <h5>General</h5>
//       <ul className="navigation-group">
//         <NavbarItem isActive={currentPage === 'dashboard'} link={() => sendToLink('dashboard')} imgSrc={dashboardIcon} desc={'Dashboard'} />
//         <NavbarItem isActive={currentPage === 'dashdboard'} link={() => sendToLink('Yoooo')} imgSrc={bookmarkIcon} desc={'Notes & Highlights'} />
//         <NavbarItem isActive={currentPage === 'registration'} link={() => sendToLink('registration')} imgSrc={libraryIcon} desc={'Chapters Read'} />
//       </ul>
//       <h5>Profile</h5>
//       <ul className="navigation-group">
//         <NavbarItem isActive={currentPage === 'dadshboard'} link={() => sendToLink('')} imgSrc={statsIcon} desc={'Progress Analytics'} />
//         <NavbarItem isActive={currentPage === 'daswhboard'} link={() => sendToLink('')} imgSrc={supportIcon} desc={'Support'} />
//         <NavbarItem isActive={currentPage === 'dasghboard'} link={() => sendToLink('')} imgSrc={settingsIcon} desc={'Settings'} />
//       </ul>
//     </>
//   );
// };