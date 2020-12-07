
# Create your views here.

# todo/views.py

from django.shortcuts import render
from rest_framework import viewsets          # add this
from .models import Shipments                     # add this
from .serializers import ShipmentsSerializer      # add this

class ShipmentsView(viewsets.ModelViewSet):       # add this
  serializer_class = ShipmentsSerializer          # add this
  queryset = Shipments.objects.all()              # add this
