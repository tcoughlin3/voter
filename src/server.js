import Server from 'socket.io';

export default function makeServer(store) {
  const io = new Server().attach(3000);

  store.subscribe(() => {
    emitState(io);
  });

  io.on('connection', (socket) => {
    emitState(socket);
    // TODO: Understand mechanism where a socket emits 'action' event
    socket.on('action', store.dispatch.bind(store));
  });

  function emitState(socket) {
    socket.emit('state', store.getState().toJS());
  }
}
