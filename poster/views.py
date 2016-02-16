from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from rest_framework.response import Response

from rest_framework.views import APIView

from post.models import Post
from post.serializers import PostSerializer


class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)

class SearchView(APIView):
    def get(self, request, format=None):
        query = request.query_params.get('query', '');
        res = Post.search.query(query).order_by('@weight')
        serialized = PostSerializer(res[0:10], many=True)
        return Response(serialized.data)