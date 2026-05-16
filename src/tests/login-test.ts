/**
 * 登录测试脚本
 * 
 * 使用测试账号：admin@example.com / Admin123!
 */

import { authApi, userApi } from '@/utils/api';
import type { LoginRequest } from '@/types/api';

// 测试账号信息
const TEST_ACCOUNT = {
  email: 'admin@example.com',
  password: 'Admin123!'
};

/**
 * 测试登录流程
 */
export async function testLogin() {
  console.log('========================================');
  console.log('🧪 开始测试登录流程');
  console.log('========================================');
  console.log('测试账号:', TEST_ACCOUNT.email);
  console.log('----------------------------------------');
  
  try {
    // 步骤 1: 登录
    console.log('📝 步骤 1: 执行登录...');
    const loginResponse = await authApi.login(TEST_ACCOUNT as LoginRequest);
    
    console.log('✅ 登录成功!');
    console.log('\n登录响应数据:');
    console.log('├─ success:', loginResponse.data.success);
    console.log('├─ message:', loginResponse.data.message);
    console.log('├─ token:', loginResponse.data.data.token?.substring(0, 50) + '...');
    console.log('├─ expiresIn:', loginResponse.data.data.expiresIn, '秒');
    console.log('└─ tokenType:', loginResponse.data.data.tokenType);
    
    console.log('\n用户信息:');
    console.log('├─ id:', loginResponse.data.data.user.id);
    console.log('├─ email:', loginResponse.data.data.user.email);
    console.log('└─ nickName:', loginResponse.data.data.user.nickName || '未设置');
    
    // 步骤 2: 获取用户详细信息
    console.log('\n----------------------------------------');
    console.log('📝 步骤 2: 获取用户详细信息...');
    const userInfoResponse = await userApi.getInfo();
    
    console.log('✅ 用户信息获取成功!');
    console.log('\n详细用户信息:');
    console.log('├─ id:', userInfoResponse.data.id);
    console.log('├─ email:', userInfoResponse.data.email);
    console.log('├─ nickName:', userInfoResponse.data.nickName || '未设置');
    console.log('├─ phoneNumber:', userInfoResponse.data.phoneNumber || '未设置');
    console.log('├─ isEnabled:', userInfoResponse.data.isEnabled);
    console.log('├─ roles:', userInfoResponse.data.roles || []);
    console.log('└─ permissions:', userInfoResponse.data.permissions || []);
    
    // 步骤 3: 获取权限码
    console.log('\n----------------------------------------');
    console.log('📝 步骤 3: 获取用户权限码...');
    const permissionsResponse = await userApi.getPermissions();
    
    console.log('✅ 权限码获取成功!');
    console.log('权限码列表:');
    permissionsResponse.data.forEach((perm, index) => {
      console.log(`├─ ${index + 1}. ${perm}`);
    });
    
    // 步骤 4: 获取菜单树
    console.log('\n----------------------------------------');
    console.log('📝 步骤 4: 获取用户菜单...');
    const menusResponse = await userApi.getMenus();
    
    console.log('✅ 菜单获取成功!');
    console.log('菜单树结构:');
    menusResponse.data.forEach((menu, index) => {
      console.log(`├─ ${index + 1}. ${menu.title} (${menu.path})`);
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => {
          console.log(`   └─ ${child.title} (${child.path})`);
        });
      }
    });
    
    // 步骤 5: 获取角色列表
    console.log('\n----------------------------------------');
    console.log('📝 步骤 5: 获取用户角色...');
    const rolesResponse = await userApi.getRoles();
    
    console.log('✅ 角色获取成功!');
    console.log('角色列表:');
    rolesResponse.data.forEach((role, index) => {
      console.log(`├─ ${index + 1}. ${role.name} (${role.code})`);
      if (role.description) {
        console.log(`      └─ ${role.description}`);
      }
    });
    
    // 步骤 6: 获取仪表盘数据
    console.log('\n----------------------------------------');
    console.log('📝 步骤 6: 获取仪表盘统计数据...');
    const dashboardResponse = await userApi.getDashboardStats();
    
    console.log('✅ 仪表盘数据获取成功!');
    console.log('统计数据:');
    console.log('├─ 文章总数:', dashboardResponse.data.totalArticles);
    console.log('├─ 评论总数:', dashboardResponse.data.totalComments);
    console.log('└─ 总访问量:', dashboardResponse.data.totalViews);
    
    // 完成
    console.log('\n========================================');
    console.log('🎉 测试完成！所有接口调用成功!');
    console.log('========================================');
    
    return {
      success: true,
      data: {
        login: loginResponse.data,
        userInfo: userInfoResponse.data,
        permissions: permissionsResponse.data,
        menus: menusResponse.data,
        roles: rolesResponse.data,
        dashboardStats: dashboardResponse.data
      }
    };
    
  } catch (error: any) {
    console.error('\n❌ 测试失败!');
    console.error('错误信息:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送，但未收到响应');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 测试权限检查功能
 */
export async function testPermissionCheck() {
  console.log('\n========================================');
  console.log('🧪 开始测试权限检查功能');
  console.log('========================================');
  
  try {
    // 先登录
    await authApi.login(TEST_ACCOUNT as LoginRequest);
    
    // 获取权限
    const permissionsResponse = await userApi.getPermissions();
    const permissions = permissionsResponse.data;
    
    console.log('当前用户权限码:', permissions);
    
    // 测试几个常见的权限检查
    const testPermissions = [
      'article:view',
      'article:create',
      'article:edit',
      'article:delete',
      'user:manage'
    ];
    
    console.log('\n权限检查结果:');
    testPermissions.forEach(perm => {
      const hasPerm = permissions.includes(perm);
      console.log(`├─ ${perm}: ${hasPerm ? '✅' : '❌'}`);
    });
    
    console.log('\n✅ 权限检查测试完成!');
    
  } catch (error: any) {
    console.error('❌ 权限检查测试失败:', error.message);
  }
}

// 如果直接在控制台运行，执行测试
if (typeof window !== 'undefined') {
  console.log('🚀 准备运行登录测试...');
  console.log('请在浏览器控制台输入：await testLogin()');
  console.log('或：await testPermissionCheck()');
  
  // 导出函数供全局使用
  (window as any).testLogin = testLogin;
  (window as any).testPermissionCheck = testPermissionCheck;
}
