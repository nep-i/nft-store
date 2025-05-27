from rest_framework import serializers

class NFTSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255)
    owner_id = serializers.CharField(max_length=255)
    url = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)