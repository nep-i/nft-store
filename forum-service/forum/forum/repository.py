from .models import Thread, Post

class ForumRepository:
    def save_thread(self, thread_data):
        thread = Thread(**thread_data)
        thread.save()
        return thread

    def get_thread(self, thread_id):
        return Thread.objects.get(id=thread_id)

    def save_post(self, post_data):
        post = Post(**post_data)
        post.save()
        return post

    def get_posts(self, thread_id):
        return Post.objects.filter(thread_id=thread_id)
