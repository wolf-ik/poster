from django.conf.urls import include, url
from django.contrib import admin

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView, CheckSession
from post.views import PostViewSet, CommentViewSet
from poster.views import IndexView, SearchView

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/search/$', SearchView.as_view(), name='search'),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/auth/session/$', CheckSession.as_view(), name='session'),

    url(r'^admin/', admin.site.urls),
    url(r'^.*$', IndexView.as_view(), name='index'),
]
