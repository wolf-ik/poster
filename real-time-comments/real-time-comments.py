import json

import tornado.web
import tornado.ioloop
import tornado.websocket


class WebSocket(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print('Open new connection: %s' % str(self))
        self.application.webSocketsPool.append({'post_id': -1,
                                                'ws': self})

    def on_message(self, message):
        print('Get message: ' + message)
        print('From: %s' % str(self))
        message_dict = json.loads(message)
        post_id = message_dict.get('post_id', None)
        if post_id is not None:
            for key, value in enumerate(self.application.webSocketsPool):
                if value['ws'] == self:
                    value['post_id'] = post_id
        else:
            for key, value in enumerate(self.application.webSocketsPool):
                if value['post_id'] == message_dict['post']:
                    if value['ws'].ws_connection is not None:
                        value['ws'].ws_connection.write_message(message)

    def on_close(self, message=None):
        print('Close connection: %s' % str(self))
        for key, value in enumerate(self.application.webSocketsPool):
            if value['ws'] == self:
                del self.application.webSocketsPool[key]


class Application(tornado.web.Application):
    def __init__(self):
        self.webSocketsPool = []

        handlers = (
            (r'/websocket/?', WebSocket),
        )

        tornado.web.Application.__init__(self, handlers)

print('Started')

application = Application()

print('Created application')

if __name__ == '__main__':
    print('Go endless loop.')
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()