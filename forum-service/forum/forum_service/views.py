from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .repositories import ForumRepository
from .serializers import ThreadSerializer, PostSerializer

class ThreadView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repo = ForumRepository()

    def post(self, request):
        serializer = ThreadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        thread = self.repo.save_thread(serializer.validated_data)
        return Response(ThreadSerializer(thread).data, status=status.HTTP_201_CREATED)

    def get(self, request, thread_id):
        try:
            thread = self.repo.get_thread(thread_id)
            return Response(ThreadSerializer(thread).data, status=status.HTTP_200_OK)
        except Thread.DoesNotExist:
            return Response({'error': 'Thread not found'}, status=status.HTTP_404_NOT_FOUND)

class PostView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repo = ForumRepository()

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = self.repo.save_post(serializer.validated_data)
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)