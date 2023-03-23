export default interface IMessage {
  id: number;
  event: 'connection' | 'disconnection' | 'message';
  username: string;
  text: string | null;
  createdAt: string;
  updatedAt: string;
}
