![](https://github.com/nathanael540/video-call-webrtc-dart-frog/blob/main/screen.jpg?raw=true)

# videoCalls - Chamada de Vídeo P2P / WebRTC

Um projeto de chamadas de vídeo P2P via WebRTC, utilizando apenas Dart, WebSockets e JavaScript.



## O que contempla este projeto?

Este repositório contém dois projetos: um o servidor em Dart Frog e um pequeno aplicativo web em HTML/JS.

### Servidor (Dart/Frog)

O servidor é um projeto Dart Frog que utiliza os pacotes `dart_frog_web_socket`  e `web_socket_channel` para ativar a comunicação via Websocket com os clientes. 

O servidor é responsável por gerenciar a lista de usuários que estão online e formar os pares de conexão entre os clientes.

### Cliente (Web)

O cliente web é um projeto HTML, CSS e JS que utiliza a biblioteca [PeerJS](https://peerjs.com/) para realizar a conexão P2P entre os clientes e fazer as chamadas de vídeo.

## Como executar?

### Opção 1: Desenvolvimento Local

#### Servidor

Para executar o servidor, é necessário ter o Dart SDK instalado e o pacote `dart_frog` instalado globalmente.

Com o  Dart SDK instalado, instale o pacote `dart_frog` com o comando:

```bash
dart pub global activate dart_frog_cli
```

Após a instalação, execute o servidor com o comando:

```bash
cd server
dart_frog dev
```

O servidor estará disponível em `http://localhost:8080`.

#### Cliente

Para executar o cliente, basta abrir o arquivo `index.html` no navegador através de qualquer servidor web. 

(Na dúvida? experimente o [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) do VSCode).

### Opção 2: Deploy com Docker 🐳

#### Execução Rápida com Docker Compose

```bash
docker-compose up --build
```

Isso irá:
- Construir e executar o servidor backend na porta 8080
- Construir e executar o frontend na porta 80
- Configurar a rede entre os serviços automaticamente

#### Container Único

```bash
# Construir a imagem
docker build -t videocall-app .

# Executar o container
docker run -p 80:80 -p 8080:8080 videocall-app
```

#### Acesso após deploy
- **Frontend**: http://localhost
- **Backend**: http://localhost:8080

Para mais opções de deploy, consulte [DOCKER.md](DOCKER.md).


### Tecnologias utilizadas neste projeto

- [Dart](https://dart.dev/)
- [Dart Frog](https://pub.dev/packages/dart_frog)
- [PeerJS](https://peerjs.com/)
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE.md](LICENSE.md) para obter detalhes.
