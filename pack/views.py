import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser

from .models import User, Gear, Pack
from .serializers import *

# Create your views here.

@login_required()
def index(request):

    categories = Gear.GEAR_CATEGORY_CHOICES
    return render(request, "pack/index.html", {
        "categories": categories
    })

def loginview(request):

    if request.method == 'POST':

        # Attempt to sign user in
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'pack/login.html', {
                'message': 'Invalid username and/or password.'
            })
    else:
        return render(request, 'pack/login.html')

@login_required()
def logoutview(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):

    if request.method == 'POST':

        # Collect fields from form
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirmation = request.POST['confirmation']

        #Ensure all fields are filled out
        if username == '' or email == '' or password == '' or confirmation == '':
            return render(request, 'pack/register.html', {
                'message': 'Please fill out all required fields'
            })

        # Ensure password matches confirmation
        if password != confirmation:
            return render(request, 'pack/register.html', {
                'message': 'Passwords must match.'
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, 'pack/register.html', {
                'message': 'Username already taken.'
            })
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'pack/register.html')

@login_required()
def gearlocker(request):

    categories = Gear.GEAR_CATEGORY_CHOICES
    return render(request, "pack/gearlocker.html", {
        "categories": categories
    })

@login_required()
def mypacks(request):
    return render(request, 'pack/mypacks.html')

@login_required()
def pack(request, pack_id):

    categories = Gear.GEAR_CATEGORY_CHOICES
    return render(request, "pack/pack.html", {
        "categories": categories
    })

# API views

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def pack_list(request):

    user=request.user

    # Returns list of all packs created by user
    if request.method == 'GET':
        data = Pack.objects.filter(user=user)
        serializer = PackSerializer(data, many=True)
        return Response(serializer.data)

    # Adds a new pack to the users list of packs
    elif request.method == 'POST':

        data = request.data
        # Add user to data
        data.update({'user': user.id})

        serializer = PackSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def pack_detail(request, pack_id):

    user=request.user

    try:
        pack = Pack.objects.get(pk=pack_id)
    except Pack.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if pack.user != user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Gets information on a specific pack
    if request.method == 'GET':
        serializer = PackSerializer(pack)
        return Response(serializer.data)

    # Deletes a specific pack
    elif request.method == 'DELETE':
        pack.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Updates details about a specific pack
    elif request.method == 'PUT':

        data = request.data
        # Add user to data
        data.update({'user': user.id})

        serializer = PackSerializer(pack, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def pack_gear_list(request, pack_id):

    user=request.user

    # Returns all pieces of gear in the specified pack
    if request.method == 'GET':
        gear = Pack.objects.get(pk=pack_id).gear
        serializer = GearSerializer(gear, many=True)
        return Response(serializer.data)

    # Adds or removes a piece of gear to the specified pack
    elif request.method == 'PUT':

        data = request.data
        gear_id = data['gear']['id']
        action = data['action']

        pack = Pack.objects.get(pk=pack_id)

        if action == 'add':
            pack.gear.add(gear_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif action == 'remove':
            pack.gear.remove(gear_id)
            return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def pack_gear_list_category(request, pack_id, category):

    user=request.user

    # Returns all pieces of gear of a specified category
    if request.method == 'GET':
        gear = Gear.objects.all().filter(user=user).filter(category=category)
        serializer = GearSerializer(gear, many=True)

        return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def gear_list(request):

    user=request.user

    if request.method == 'GET':
        data = Gear.objects.filter(user=user)
        serializer = GearSerializer(data, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        data = request.data
        # Add user to data
        data.update({'user': user.id})

        serializer = GearSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else: 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def gear_detail(request, gear_id):

    user=request.user

    try:
       gear = Gear.objects.get(pk=gear_id)
    except Pack.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if gear.user != user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Gets information on a specific piece of gear
    if request.method == 'GET':
        serializer = GearSerializer(gear)
        return Response(serializer.data)

    # Deletes a specific piece of gear
    elif request.method == 'DELETE':
        gear.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Updates details about a specific piece of gear
    elif request.method == 'PUT':

        data = request.data
        # Add user to data
        data.update({'user': user.id})

        serializer = GearSerializer(gear, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def gear_categories(request):

    categories = Gear.GEAR_CATEGORY_CHOICES
    return Response(categories)

