import { request } from 'umi';
import Qs from "qs";
import {CategoryListItem} from './data'


export async function cateroryList(params:any) {
  return request('https://www.rdinterview.top/admin/category/list',{
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}

export async function addCaterory(params: CategoryListItem) {
  const formData = new FormData();
  for (const key in params) {
      formData.append(key, params[key]);
  }
  return request('https://www.rdinterview.top/admin/category/create', {
    method: 'POST',
    data:formData,
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}

export async function removeCaterory(params: CategoryListItem) {
  return request('https://www.rdinterview.top/admin/category/delete?categoryId='+params.id, {
    headers:{"Authorization": localStorage.getItem('Authorization')}
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
  return request('https://www.rdinterview.top/admin/category/update', {
    method: 'POST',
    data:formData,
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}


