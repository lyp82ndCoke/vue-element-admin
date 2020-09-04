// import router.js
import router from "../router/index";
// 对比用户权限
function haveRole(router, roles) {
  if (router.name) {
    const role = router.name;
    if (roles.indexOf(role) !== -1) {
      router.hidden = false;
      if (!router.leaf && router.children) {
        for (let index = 0; index < router.children.length; index++) {
          const children = router.children[index];
          haveRole(children, roles);
        }
      }
    }
  }
}
export function formatRouter(roles) {
  const routes = router.options.routes;
  // 遍历现有router
  // console.log(roles)
  for (let index = 0; index < routes.length; index++) {
    const element = routes[index];
    // console.log(element)
    // 根据用户权限格式化菜单数据
    haveRole(element, roles);
  }
}
