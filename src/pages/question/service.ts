import { request } from 'umi';
import Qs from "qs";
import {QuestionListItem} from './data'


export async function questionList(params:any) {
    if(params['categoryId'] === undefined){
      params['categoryId'] = '1';
    }
    return request('/interview/admin/question/list?categoryId='+params['categoryId']+'&page='+(params['current'] -1),{
      headers:{"Authorization": localStorage.getItem('Authorization')}
    });
}

export async function addQuestion(params: QuestionListItem) {
  const formData = new FormData();
  for (const key in params) {
      formData.append(key, params[key]);
  }
  return request('/interview/admin/question/create', {
    method: 'POST',
    data:formData,
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}

export async function questionDetail(params:number) {
  return request('/interview/admin/question/info?questionId='+params,{
    headers:{"Authorization": localStorage.getItem('Authorization')}
  });
}


