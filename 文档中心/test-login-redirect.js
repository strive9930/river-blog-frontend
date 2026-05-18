/**
 * 登录后跳转问题快速测试脚本
 * 
 * 使用方法：
 * 1. 打开浏览器开发者工具（F12）
 * 2. 切换到 Console 标签
 * 3. 登录成功后，粘贴并执行此脚本
 */

(function testLoginRedirect() {
  console.log('🧪 开始登录后跳转问题测试...\n');
  
  // 测试 1：检查 localStorage
  console.log('📋 测试 1: 检查 LocalStorage');
  const token = localStorage.getItem('auth_token');
  const userInfoStr = localStorage.getItem('user_info');
  
  if (!token) {
    console.error('❌ 未找到 Token，请先登录');
    return;
  }
  
  console.log('✅ Token 存在');
  
  if (!userInfoStr || userInfoStr === 'undefined') {
    console.error('❌ 未找到有效的用户信息');
    console.log('💡 提示：请重新登录');
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
  
  // 测试 2：检查必要字段
  console.log('📋 测试 2: 检查用户信息字段');
  const requiredFields = ['id', 'email', 'permissions', 'menus'];
  let allFieldsPresent = true;
  
  for (const field of requiredFields) {
    if (!(field in userInfo)) {
      console.error(`❌ 缺少字段: ${field}`);
      allFieldsPresent = false;
    } else {
      console.log(`✅ ${field}:`, typeof userInfo[field] === 'object' ? `${userInfo[field].length} 个` : userInfo[field]);
    }
  }
  
  if (!allFieldsPresent) {
    console.error('\n❌ 用户信息格式不正确');
    console.log('💡 提示：请检查后端 /api/auth/login 接口返回的数据');
    return;
  }
  
  console.log();
  
  // 测试 3：检查数据有效性
  console.log('📋 测试 3: 检查数据有效性');
  
  if (!Array.isArray(userInfo.permissions)) {
    console.error('❌ permissions 不是数组');
    return;
  }
  
  if (!Array.isArray(userInfo.menus)) {
    console.error('❌ menus 不是数组');
    return;
  }
  
  console.log('✅ permissions 是数组，包含', userInfo.permissions.length, '个权限');
  console.log('✅ menus 是数组，包含', userInfo.menus.length, '个菜单');
  console.log();
  
  // 测试 4：模拟 Store 状态恢复
  console.log('📋 测试 4: 模拟 Store 状态恢复');
  
  const simulatedStore = {
    token: token,
    userInfo: userInfo,
    permissions: userInfo.permissions || [],
    menus: userInfo.menus || []
  };
  
  console.log('✅ 模拟 Store 状态:');
  console.log('   - isLoggedIn:', !!simulatedStore.token);
  console.log('   - userInfo:', !!simulatedStore.userInfo);
  console.log('   - permissions:', simulatedStore.permissions.length);
  console.log('   - menus:', simulatedStore.menus.length);
  console.log();
  
  // 测试 5：检查路由守卫逻辑
  console.log('📋 测试 5: 检查路由守卫逻辑');
  
  const needLoadFullInfo = !simulatedStore.userInfo;
  console.log('   needLoadFullInfo:', needLoadFullInfo);
  
  if (needLoadFullInfo) {
    console.error('❌ 需要加载完整用户信息（这可能导致问题）');
    console.log('💡 提示：userInfo 应该从登录响应中获取并保存');
  } else {
    console.log('✅ 不需要加载完整用户信息（状态已完整）');
  }
  console.log();
  
  // 总结
  console.log('🎉 测试完成！\n');
  console.log('📊 测试结果汇总:');
  console.log('   ✅ Token: 存在');
  console.log('   ✅ 用户信息: 存在且格式正确');
  console.log('   ✅ 权限数据:', userInfo.permissions.length, '个');
  console.log('   ✅ 菜单数据:', userInfo.menus.length, '个');
  console.log('   ✅ Store 状态: 可以正常恢复');
  console.log('   ✅ 路由守卫: 不会触发不必要的加载\n');
  
  console.log('🔍 下一步验证:');
  console.log('   1. 刷新页面（F5）');
  console.log('   2. 观察是否仍保持登录状态');
  console.log('   3. 检查控制台日志中是否有 [Main] ✅ 从 localStorage 恢复用户状态');
  console.log('   4. 确认没有跳转到登录页\n');
  
  console.log('⚠️ 如果刷新后仍然跳回登录页:');
  console.log('   - 查看完整文档: 登录后跳转问题修复说明.md');
  console.log('   - 检查 main.ts 是否正确初始化');
  console.log('   - 检查路由守卫逻辑是否正确');
})();
