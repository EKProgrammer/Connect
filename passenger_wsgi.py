# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, '/home/m/mazuraty/connect-ai.ru/connectapp')
sys.path.insert(1, '/home/m/mazuraty/connect-ai.ru/venv/lib/python3.12/site-packages')
os.environ['DJANGO_SETTINGS_MODULE'] = 'connectapp.settings'
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
