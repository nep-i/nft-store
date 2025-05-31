from django.urls import path
from .views import ThreadView, PostView

urlpatterns = [
    path('thread/', ThreadView.as_view(), name='thread-create'),
    path('thread/<str:thread_id>/', ThreadView.as_view(), name='thread-detail'),
    path('post/', PostView.as_view(), name='post-create'),
]