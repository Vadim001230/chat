export default interface IMessage {
  id: number;
  event: 'connection' | 'message';
  username: string;
  text: string | null;
  createdAt: string;
  updatedAt: string;
}
