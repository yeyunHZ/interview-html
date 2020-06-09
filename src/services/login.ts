import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  const formData = new FormData();
  for (var key in params) {
     formData.append(key, params[key]);
  }
  return request<API.LoginStateType>('/interview/admin/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
