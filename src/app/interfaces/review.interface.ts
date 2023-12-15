export interface ReviewInterface {
  owner: string;
  mediaId: string;
  rating?: number;
  review?: string;
  edited?: boolean;
  type: string;
  createdAt?: Date;
  isComment?: boolean;
  replyTo?: any;
  id?: number;
}
