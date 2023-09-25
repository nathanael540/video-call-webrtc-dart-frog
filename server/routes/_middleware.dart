import 'package:dart_frog/dart_frog.dart';

import '../providers/users_notifier.dart';

Handler middleware(Handler handler) => handler.use(usersProvider);
