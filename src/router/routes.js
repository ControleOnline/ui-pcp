export const routes = [
  {
    path: "/displays",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "displayList",
        path: "",
        component: () => import("../pages/Displays/Displays.vue"),
      },
      {
        name: "displayDetails",
        path: "id/:id",
        component: () => import("../pages/Displays/Queue.vue"),
      }
    ],
  },

];
