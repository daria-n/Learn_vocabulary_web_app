from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
# from django.http import HttpResponse
from django.views import generic
# from django.views.generic import View
from .models import Word, Category
from .forms import UserForm
from django.http import JsonResponse
import json as js
# from django.urls import reverse


# Create your views here.
# def index(request):
#     all_words = Word.objects.all()
#     context = {'my_words': all_words}
#     return render(request, 'vocabulary/index.html', context)


class IndexView(generic.ListView):
    template_name = 'vocabulary/index.html'
    context_object_name = 'my_words'

    def get_queryset(self):
        return Word.objects.all()

    def get(self, request):
        if not request.user.is_authenticated():
            return render(request, 'vocabulary/index_visitor.html')
        else:
            return render(request, self.template_name, {self.context_object_name: self.get_queryset()})


def json(request):
    if request.is_ajax():
        command = request.GET['Command']
        category_id = Category.objects.get(category=command).id
        my_data = Word.objects.filter(category=category_id)
        total_num = my_data.count()
        data = js.dumps({'words': [{'eng': elem.english, 'pol': elem.polish} for elem in my_data]})
        context = {'all_data': data, 'counter': total_num}
        return JsonResponse(context, safe=False)
    else:
        # return redirect('vocabulary:index')
        my_data = Word.objects.all()
        my_data = list(reversed(my_data))
        count = len(my_data)
        return render(request, 'vocabulary/json.html', {'current_data': my_data, 'count': count})


class LearningView(generic.ListView):
    template_name = 'vocabulary/learn.html'
    context_object_name = 'categories'

    def get_queryset(self):
        return Category.objects.all()

    def get(self, request):
        if not request.user.is_authenticated():
            return redirect('vocabulary:index')
        else:
            return render(request, self.template_name, {self.context_object_name: self.get_queryset()})


class CategoryLearningView(generic.DetailView):
    model = Category
    template_name = 'vocabulary/learn_category.html'
    slug_url_kwarg = 'slug'

    def get(self, request, **kwargs):
        if not request.user.is_authenticated():
            return redirect('vocabulary:index')
        else:
            self.object = self.get_object()
            context = self.get_context_data(object=self.object)
            return self.render_to_response(context)


class TestingView(generic.ListView):
    template_name = 'vocabulary/test.html'
    context_object_name = 'categories'

    def get_queryset(self):
        return Category.objects.all()

    def get(self, request):
        if not request.user.is_authenticated():
            return redirect('vocabulary:index')
        else:
            return render(request, self.template_name, {self.context_object_name: self.get_queryset()})


class CategoryTestingView(generic.DetailView):
    model = Category
    template_name = 'vocabulary/test_category.html'
    slug_url_kwarg = 'slug'

    def get(self, request, **kwargs):
        if not request.user.is_authenticated():
            return redirect('vocabulary:index')
        else:
            self.object = self.get_object()
            context = self.get_context_data(object=self.object)
            return self.render_to_response(context)


class UserFormView(generic.View):
    form_class = UserForm
    template_name = 'vocabulary/registration_form.html'

    # display blank form
    def get(self, request):
        if request.user.is_authenticated():
            return redirect('vocabulary:index')
        else:
            form = self.form_class(None)
            return render(request, self.template_name, {'form': form})

    # process form data
    def post(self, request):
        form = self.form_class(request.POST)

        if form.is_valid():

            user = form.save(commit=False)

            # cleaned (normalized) data
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()

            # returns User objects if credentials are correct
            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect('vocabulary:index')

        return render(request, self.template_name, {'form': form})


class LoginView(generic.View):
    form_class = UserForm
    template_name = 'vocabulary/login_form.html'

    # display blank form
    def get(self, request):
        if request.user.is_authenticated():
            return redirect('vocabulary:index')
        else:
            form = self.form_class(None)
            return render(request, self.template_name, {'form': form})

    # process form data
    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']

        # returns User objects if credentials are correct
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('vocabulary:index')
            else:
                return render(request, self.template_name, {'error_message': 'Your account has been disabled'})
        else:
            return render(request, self.template_name, {'error_message': 'Invalid login'})


class LogoutView(generic.ListView):
    # template_name = 'vocabulary/index_visitor.html'
    # context_object_name = 'any_name_here'

    def get(self, request):
        logout(request)
        return redirect('vocabulary:index')
