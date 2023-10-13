import Dashboard from "@material-ui/icons/Dashboard";
import LockIcon from "@material-ui/icons/Lock";
import EcoIcon from "@material-ui/icons/Eco";
import EmojiNatureIcon from "@material-ui/icons/EmojiNature";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// core components/views for Admin layout
import DashboardPage from "./views/Dashboard/Dashboard.js";
import UserProfile from "./views/UserProfile/UserProfile.js";
import TableList from "./views/TableList/TableList.js";
import Typography from "./views/Typography/Typography.js";
import Icons from "./views/Icons/Icons.js";
// import Maps from "./views/Maps/Maps.js";
import NotificationsPage from "./views/Notifications/Notifications.js";
import UpgradeToPro from "./views/UpgradeToPro/UpgradeToPro.js";

import TokenLock from "./views/TokenLock/TokenLock.js";
import Presale from "./views/Presale/Presale.js";
import LiquidityLock from "./views/LiquidityLock/LiquidityLock.js";
import Farm from "./views/Farm/Farm.js";
import Staking from "./views/Staking/Staking.js";
import CreateToken from "./views/CreateToken/CreateToken.js";
// core components/./views for RTL layout
import RTLPage from "./views/RTLPage/RTLPage.js";

const dashboardRoutes = [
  {
    path: "/tokenlock",
    name: "Token Lock",
    rtlName: "التطور للاحترافية",
    icon: LockIcon,
    component: TokenLock,
    layout: "/client",
  },
  {
    path: "/liquiditylock",
    name: "Liquidity Lock",
    rtlName: "التطور للاحترافية",
    icon: LockIcon,
    component: LiquidityLock,
    layout: "/client",
  },
  {
    path: "/farm",
    name: "Farm",
    rtlName: "التطور للاحترافية",
    icon: EcoIcon,
    component: Farm,
    layout: "/client",
  },
  {
    path: "/staking",
    name: "Staking",
    rtlName: "التطور للاحترافية",
    icon: EmojiNatureIcon,
    component: Staking,
    layout: "/client",
  },
  {
    path: "/presale",
    name: "Presale",
    rtlName: "لوحة القيادة",
    icon: MonetizationOnIcon,
    component: Presale,
    layout: "/client",
  },
  {
    path: "/createtoken",
    name: "CreateToken",
    rtlName: "لوحة القيادة",
    icon: AddCircleOutlineIcon,
    component: CreateToken,
    layout: "/client",
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   rtlName: "لوحة القيادة",
  //   icon: MonetizationOnIcon,
  //   component: DashboardPage,
  //   layout: "/client",
  // },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: MonetizationOnIcon,
  //   component: UserProfile,
  //   layout: "/client",
  // },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: MonetizationOnIcon,
  //   component: TableList,
  //   layout: "/client",
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: MonetizationOnIcon,
  //   component: Typography,
  //   layout: "/client",
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: MonetizationOnIcon,
  //   component: Icons,
  //   layout: "/client",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: MonetizationOnIcon,
  //   component: NotificationsPage,
  //   layout: "/client",
  // },
  // // {
  // //   path: "/rtl-page",
  // //   name: "RTL Support",
  // //   rtlName: "پشتیبانی از راست به چپ",
  // //   icon: MonetizationOnIcon,
  // //   component: RTLPage,
  // //   layout: "/rtl",
  // // },
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   rtlName: "التطور للاحترافية",
  //   icon: MonetizationOnIcon,
  //   component: UpgradeToPro,
  //   layout: "/client",
  // },
];

export default dashboardRoutes;
