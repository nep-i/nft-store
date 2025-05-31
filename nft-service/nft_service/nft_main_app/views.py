import boto3
import uuid
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .repositories import NFTRepository
from .serializers import NFTSerializer
from decouple import config
from datetime import datetime

class NFTView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repo = NFTRepository()
        self.s3 = boto3.client(
            's3',
            endpoint_url=f"http://{config('MINIO_ENDPOINT')}",
            aws_access_key_id=config('MINIO_ACCESS_KEY'),
            aws_secret_access_key=config('MINIO_SECRET_KEY'),
        )

    def post(self, request):
        serializer = NFTSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        nft_id = str(uuid.uuid4())
        name = serializer.validated_data['name']
        owner_id = serializer.validated_data['owner_id']
        file_content = request.data.get('file_content')  # Base64 or binary

        bucket = 'nft-art'
        key = f"{nft_id}-{name}"

        # Create bucket if it doesn't exist
        try:
            self.s3.create_bucket(Bucket=bucket)
        except self.s3.exceptions.BucketAlreadyOwnedByYou:
            pass

        # Upload file to MinIO
        self.s3.upload_fileobj(
            Fileobj=BytesIO(base64.b64decode(file_content)),
            Bucket=bucket,
            Key=key,
            ExtraArgs={'ContentType': 'image/png'}  # Adjust based on file type
        )

        # Generate presigned URL
        url = self.s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=3600
        )

        # Save metadata to MongoDB
        nft = {
            'id': nft_id,
            'name': name,
            'owner_id': owner_id,
            'url': url,
            'created_at': datetime.now()
        }
        self.repo.save_nft(nft)

        return Response(NFTSerializer(nft).data, status=status.HTTP_201_CREATED)

    def get(self, request, nft_id):
        nft = self.repo.get_nft(nft_id)
        if not nft:
            return Response({'error': 'NFT not found'}, status=status.HTTP_404_NOT_FOUND)

        # Generate fresh presigned URL
        url = self.s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': 'nft-art', 'Key': f"{nft['id']}-{nft['name']}"},
            ExpiresIn=3600
        )
        nft['url'] = url
        
    def get_all(self, request, owner_id):
        nft_all = self.repo.get_nft_all(owner_id)
        if not nft_all:
            return Response({'error': 'NFT not found'}, status=status.HTTP_404_NOT_FOUND)

        urls = [
            {'id': nft['id'], 'name': nft['name'], 'url': self.s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': 'nft-art', 'Key': f"{nft['id']}-{nft['name']}"},
                ExpiresIn=3600
            )}
            for nft in nft_all
        ]

        return Response(urls, status=status.HTTP_200_OK)
