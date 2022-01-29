/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";

const dashboardRoutes = [
  {
    path: "/creator-dashboard",
    name: "Create Dashboard",
    icon: Dashboard,

    layout: "/admin",
  },
  {
    path: "/unsold-items",
    name: "Marketplace",
    icon: LibraryBooks,

    layout: "/admin",
  },
  {
    path: "/create-item",
    name: "Create Item",
    icon: BubbleChart,

    layout: "/admin",
  },
  {
    path: "/my-collections",
    name: "My Collections",
    icon: BubbleChart,

    layout: "/admin",
  },
];

export default dashboardRoutes;
