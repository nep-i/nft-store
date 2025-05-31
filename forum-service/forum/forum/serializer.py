from rest_framework import serializers
from .models import Thread, Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'thread', 'content', 'created_by', 'created_at']

class ThreadSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'title', 'created_by', 'created_at', 'posts']