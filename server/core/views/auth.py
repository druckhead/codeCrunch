from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers.UserSerializers import UserSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    # you will get here only if the user is already authenticated!
    user_serializer = UserSerializer(instance=request.user, many=False)
    return Response(data=user_serializer.data)
