import { request } from 'umi';
import Qs from "qs";
import {ArticleListItem} from './data'


export async function articleList(params:any) {
  if(params['categoryId'] === undefined){
    params['categoryId'] = '1';
  }
  return request('/interview/admin/article/list?categoryId='+params['categoryId']+'&page='+(params['current'] -1),{
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}


export async function addArticle(params: ArticleListItem) {
  const formData = new FormData();
  for (const key in params) {
      formData.append(key, params[key]);
  }
  if(params['imageUrl'] == null){
    formData.append('imageUrl','');
  }
  return request('/interview/admin/article/create', {
    method: 'POST',
    data:formData,
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}


export async function removeArticle(params: ArticleListItem) {
  return request('/interview/admin/article/delete?articleId='+params.id, {
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}

export async function updateArticle(params: any) {
  const formData = new FormData();
  for (var key in params) {
      if(key === 'id'){
        formData.append('articleId', params[key]);
      }else{
        formData.append(key, params[key]);
      }

  }
  return request('/interview/admin/article/update', {
    method: 'POST',
    data:formData,
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}
