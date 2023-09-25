import 'package:dart_frog/dart_frog.dart';
import 'package:state_notifier/state_notifier.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../classes/user.dart';

class UsersNotifier extends StateNotifier<List<User>> {
  UsersNotifier() : super(const <User>[]);

  void add(User user) {
    if (state.any((u) => u.id == user.id)) return;

    state = [...state, user];
  }

  void remove(User user) {
    state = state.where((u) => u.id != user.id).toList();
  }

  bool canCreateRoom(User currentUser) {
    return state.any((user) => user.id != currentUser.id);
  }

  User getFriend(User currentUser) {
    final users = state.where((user) => user.id != currentUser.id).toList();
    final user = users.first;
    state = users.sublist(1)..shuffle();
    return user;
  }

  void removeChannel(WebSocketChannel channel) {
    state = state.where((u) => u.channel != channel).toList();
  }

  @override
  bool updateShouldNotify(List<User> old, List<User> current) {
    return old.length != current.length;
  }
}

// Criamos um provider para ser usado no middleware
final _users = UsersNotifier();
final usersProvider = provider<UsersNotifier>((_) => _users);
