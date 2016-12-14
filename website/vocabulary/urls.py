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
    # /vocabulary/test1/ (translate english word into polish)
    url(r'^test1/$', views.TestingView1.as_view(), name='testing1_categories'),
    # /vocabulary/test2/ (translate polish word into english)
    url(r'^test2/$', views.TestingView2.as_view(), name='testing2_categories'),
    # /vocabulary/test{1,2}/<category_name>/
    url(r'^test_translate/(?P<slug>[-\w]+)/$', views.CategoryTestingView.as_view(), name='testing_translate'),
    # /tralala/json/
    url(r'^tralala/json', views.json, name='json'),
]
