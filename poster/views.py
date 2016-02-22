from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from rest_framework.response import Response

from rest_framework.views import APIView

from post.models import Post, Tag
from post.serializers import PostSerializer


class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)


class SearchView(APIView):
    def get(self, request, format=None):
        query = request.query_params.get('query', '')
        query_list = query.split(' ')
        tags = []
        for q in query_list:
            tag = Tag.search.query(q).order_by('@weight')
            tags += tag
        res = []
        for tag in tags:
            res += tag.posts_for_this_tag.all()
        res = list(set(res))
        serialized = PostSerializer(res[0:10], many=True)
        return Response(serialized.data)
