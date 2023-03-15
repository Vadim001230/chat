export default interface Message {
  event: string;
  username: string;
  id: number;
  message?: string;
}
