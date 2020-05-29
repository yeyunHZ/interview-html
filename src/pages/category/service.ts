import { request } from 'umi';
import Qs from "qs";
import {CategoryListItem} from './data'


export async function cateroryList(params:any) {
  return request('/interview/admin/category/list',{
    params
  });
}

export async function addCaterory(params: CategoryListItem) {
  const formData = new FormData();
  for (const key in params) {
      formData.append(key, params[key]);
  }
  return request('/interview/admin/category/create', {
    method: 'POST',
    data:formData,
  });
}

export async function removeCaterory(params: CategoryListItem) {
  return request('/interview/admin/category/delete?categoryId='+params.id, {
  });
}

export async function updateCaterory(params: any) {
  const formData = new FormData();
  for (var key in params) {
      if(key === 'id'){
        formData.append('categoryId', params[key]);
      }else{
        formData.append(key, params[key]);
      }

  }
  return request('/interview/admin/category/update', {
    method: 'POST',
    data:formData,
  });
}


