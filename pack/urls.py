from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.loginview, name='login'),
    path('logout', views.logoutview, name='logout'),
    path('gearlocker', views.gearlocker, name='gearlocker'),
    path('mypacks', views.mypacks, name='mypacks'),
    path('mypacks/pack/<int:pack_id>/', views.pack, name='pack'),
    path('register', views.register, name='register'),

    # API Routes
    # Pack
    path('api/pack/', views.pack_list, name='all packs'),
    path('api/pack/<int:pack_id>/', views.pack_detail, name='pack'),
    path('api/pack/<int:pack_id>/gear', views.pack_gear_list, name='pack gear list'),
    path('api/pack/<int:pack_id>/category/<str:category>', views.pack_gear_list_category, name='pack gear list category'),

    # Gear
    path('api/gear/', views.gear_list, name='gear'),
    path('api/gear/<int:gear_id>', views.gear_detail, name='gear'),
    path('api/gear/categories', views.gear_categories, name='gear categories'),

]