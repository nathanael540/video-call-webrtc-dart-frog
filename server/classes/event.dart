import 'dart:convert';

class Event {
  Event(this.name, this.data);

  factory Event.fromJson(String source) =>
      Event.fromMap(json.decode(source) as Map<String, dynamic>);

  factory Event.fromMap(Map<String, dynamic> map) {
    return Event(
      map['name'] as String,
      map['data'],
    );
  }

  String name;
  dynamic data;

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'name': name,
      'data': data,
    };
  }

  String toJson() => json.encode(toMap());

  @override
  String toString() => toJson();
}
