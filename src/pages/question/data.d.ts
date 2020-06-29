export interface QuestionListItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  title: string;
  answerId: number;
}
export interface AnswerListItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  questionId: number;
  content: string;
}
