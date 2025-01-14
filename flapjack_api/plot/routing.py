from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from flapjack_api.channels_middleware import TokenAuthMiddleware
from .consumers import PlotConsumer


websockets = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
        URLRouter([
            path(
                "plot", PlotConsumer,
                name="plot-ws",
            ),
        ])
    ),
})
