export interface ArticleListItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  categoryId:number;
  title: string;
  content: string;
  imageUrl: string;
  viewNum: number;
  showType: number;
}
