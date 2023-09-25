import 'package:dart_frog/dart_frog.dart';
import 'package:dart_frog_web_socket/dart_frog_web_socket.dart';

import '../classes/event.dart';
import '../classes/user.dart';
import '../providers/users_notifier.dart';

Future<Response> onRequest(RequestContext context) async {
  Event createRoom(User user, User friend) {
    return Event('room', [
      user.id,
      friend.id,
    ]);
  }

  final handler = webSocketHandler(
    (WebSocketChannel channel, String? protocol) {
      channel.stream.listen(
        (dynamic message) {
          if (!(message as String).startsWith('{')) return;

          final event = Event.fromJson(message);
          final users = context.read<UsersNotifier>();

          if (event.name == 'join') {
            final user = User.fromJson(event.data as String)..channel = channel;
            if (users.canCreateRoom(user)) {
              final friend = users.getFriend(user);
              final room = createRoom(user, friend);
              friend.channel?.sink.add(room.toJson());
              user.channel?.sink.add(room.toJson());
            } else {
              users.add(user);
            }
          }
        },
        onDone: () {
          context.read<UsersNotifier>().removeChannel(channel);

          channel.sink.close();
        },
      );
    },
  );

  return handler(context);
}
