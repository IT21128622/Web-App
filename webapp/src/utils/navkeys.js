export const navKeys = [
  {
    key: "dashboard",
    name: "Dashboard",
    icon: "FaHome",
    subPages: [],
  },
  {
    key: "users",
    name: "Users",
    icon: "FaUsers",
    subPages: [
      { key: "admins", name: "Admins" },
      { key: "csr", name: "CSR" },
      { key: "vendors", name: "Vendors" },
      { key: "customers", name: "Customers" },
    ],
  },
  {
    key: "orders",
    name: "Orders",
    icon: "FaShoppingCart",
    subPages: [], // No subpages, orders main page
  },
  {
    key: "inventory",
    name: "Inventory",
    icon: "FaBoxes",
    subPages: [], // No subpages, inventory main page
  },
  {
    key: "products",
    name: "Products",
    icon: "FaBox",
    subPages: [], // Products main page
  },
  {
    key: "comments",
    name: "Comments",
    icon: "FaBox",
    subPages: [], // Products main page
  },
];
