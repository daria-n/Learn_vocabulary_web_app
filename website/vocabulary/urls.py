from django.conf.urls import url
from . import views

app_name = 'vocabulary'

urlpatterns = [
    # /vocabulary/
    url(r'^$', views.IndexView.as_view(), name='index'),
    # /login/
    url(r'^login/$', views.LoginView.as_view(), name='logging_in'),
    # /register/
    url(r'^register/$', views.UserFormView.as_view(), name='registering'),
    # /logout/
    url(r'^logout/$', views.LogoutView.as_view(), name='logging_out'),
    # /vocabulary/learn/
    url(r'^learn/$', views.LearningView.as_view(), name='learning'),
    # /vocabulary/learn/<category_name>/
    url(r'^learn/(?P<slug>[-\w]+)/$', views.CategoryLearningView.as_view(), name='learn_by_category'),
    # /vocabulary/test/
    url(r'^test/$', views.TestingView.as_view(), name='testing'),
    # /vocabulary/test/<category_name>/
    url(r'^test/(?P<slug>[-\w]+)/$', views.CategoryTestingView.as_view(), name='test_by_category'),
    # /tralala/json/
    url(r'^tralala/json', views.json, name='json'),
]
