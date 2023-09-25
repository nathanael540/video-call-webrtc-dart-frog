import 'dart:convert';
import 'package:dart_frog_web_socket/dart_frog_web_socket.dart';

class User {
  User(this.id);

  factory User.fromJson(String source) =>
      User.fromMap(json.decode(source) as Map<String, dynamic>);

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      map['id'] as String,
    );
  }

  String id;
  WebSocketChannel? channel;

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
    };
  }

  String toJson() => json.encode(toMap());

  @override
  String toString() => toJson();
}
