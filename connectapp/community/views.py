from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def community(request):
    return render(request, "community/community.html")
