import Server from 'socket.io';

export default function makeServer() {
  const io = new Server().attach(3000);
}
