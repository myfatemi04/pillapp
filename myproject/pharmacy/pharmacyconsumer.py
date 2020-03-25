from channels.generic.websocket import WebsocketConsumerp

class PharmacyConsumer(WebsocketConsumer):
    def connect(self):
        sess = self.scope['session']
        if 'pharmacy_id' in sess:
            self.pharmacy_id = sess['pharmacy_id']
            self.accept()
            self.send(text_data='{"orders":[]}')
        else:
            pass

    def receive(self, *, text_data):
        self.send(text_data="Received request")
    
    def disconnect(self, message):
        pass
