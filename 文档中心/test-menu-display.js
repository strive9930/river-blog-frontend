/**
 * 菜单显示问题快速测试脚本
 * 
 * 使用方法：
 * 1. 打开浏览器开发者工具（F12）
 * 2. 切换到 Console 标签
 * 3. 粘贴并执行此脚本
 */

(async function testMenuDisplay() {
  console.log('🧪 开始菜单显示测试...\n');
  
  // 测试 1：检查 localStorage
  console.log('📋 测试 1: 检查 LocalStorage');
  const token = localStorage.getItem('auth_token');
  const userInfoStr = localStorage.getItem('user_info');
  
  if (!token) {
    console.error('❌ 未找到 Token，请先登录');
    return;
  }
  
  console.log('✅ Token 存在');
  
  if (!userInfoStr) {
    console.error('❌ 未找到用户信息');
    return;
  }
  
  console.log('✅ 用户信息存在');
  
  let userInfo;
  try {
    userInfo = JSON.parse(userInfoStr);
    console.log('✅ 用户信息解析成功\n');
  } catch (e) {
    console.error('❌ 用户信息解析失败:', e);
    return;
  }
  
  // 测试 2：检查菜单数据
  console.log('📋 测试 2: 检查菜单数据');
  console.log('   菜单数量:', userInfo.menus?.length || 0);
  
  if (!userInfo.menus || userInfo.menus.length === 0) {
    console.error('❌ 菜单数据为空');
    console.log('\n💡 提示：请检查后端 /api/auth/login 接口是否返回 menus 字段');
    return;
  }
  
  console.log('✅ 菜单数据存在且不为空');
  console.log('   第一个菜单:', userInfo.menus[0]);
  console.log();
  
  // 测试 3：检查菜单格式
  console.log('📋 测试 3: 检查菜单格式');
  const requiredFields = ['id', 'name', 'title', 'path', 'children'];
  let formatValid = true;
  
  for (let i = 0; i < Math.min(userInfo.menus.length, 3); i++) {
    const menu = userInfo.menus[i];
    const missingFields = requiredFields.filter(field => !(field in menu));
    
    if (missingFields.length > 0) {
      console.error(`❌ 菜单 ${i + 1} 缺少字段:`, missingFields);
      formatValid = false;
    } else {
      console.log(`✅ 菜单 ${i + 1} 格式正确: ${menu.title} (${menu.path})`);
    }
  }
  
  if (!formatValid) {
    console.log('\n💡 提示：菜单必须包含 id, name, title, path, children 字段');
    return;
  }
  
  console.log();
  
  // 测试 4：模拟菜单转换
  console.log('📋 测试 4: 模拟菜单转换');
  
  const transformMenuData = (menus, parentPath = '') => {
    const result = [];
    
    const traverse = (menuList, parentPath = '') => {
      for (const menu of menuList) {
        const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path;
        
        result.push({
          name: menu.name,
          path: fullPath.startsWith('/') ? fullPath : `/${fullPath}`,
          title: menu.title || menu.name
        });
        
        if (menu.children && menu.children.length > 0) {
          traverse(menu.children, fullPath);
        }
      }
    };
    
    traverse(menus);
    return result;
  };
  
  const transformedMenus = transformMenuData(userInfo.menus);
  console.log('✅ 菜单转换成功');
  console.log('   转换后菜单项数量:', transformedMenus.length);
  console.log('   转换后的菜单:');
  transformedMenus.forEach((menu, index) => {
    console.log(`     ${index + 1}. ${menu.title} -> ${menu.path}`);
  });
  console.log();
  
  // 测试 5：检查 Store 状态（如果可用）
  console.log('📋 测试 5: 检查 Store 状态');
  
  try {
    // 尝试访问 Vue 实例
    const appElement = document.querySelector('#app');
    if (appElement && appElement.__vue_app__) {
      console.log('✅ 检测到 Vue 应用');
      console.log('💡 请在 Vue 组件中检查 userStore.menus 的值');
    } else {
      console.log('⚠️ 无法直接访问 Vue 实例');
      console.log('💡 请在浏览器控制台导入 useUserStore 进行检查');
    }
  } catch (e) {
    console.log('⚠️ 无法检查 Vue 实例:', e.message);
  }
  
  console.log();
  
  // 总结
  console.log('🎉 测试完成！');
  console.log('\n📊 测试结果汇总:');
  console.log('   ✅ Token: 存在');
  console.log('   ✅ 用户信息: 存在');
  console.log('   ✅ 菜单数据:', userInfo.menus.length, '个');
  console.log('   ✅ 菜单格式: 正确');
  console.log('   ✅ 菜单转换:', transformedMenus.length, '个菜单项');
  
  console.log('\n🔍 下一步:');
  console.log('   1. 检查导航栏是否显示菜单');
  console.log('   2. 检查 Network 标签中是否有 /api/userfrontend/menus 请求（应该没有）');
  console.log('   3. 点击菜单项测试跳转功能');
  
  console.log('\n⚠️ 如果菜单仍未显示:');
  console.log('   - 查看完整的诊断指南: 菜单显示问题诊断.md');
  console.log('   - 检查 NavBar.vue 组件是否正确更新');
  console.log('   - 清除浏览器缓存并刷新页面');
})();
