import json

from django.contrib.auth import authenticate, login, logout

from rest_framework import permissions, status, views, viewsets
from rest_framework.response import Response

from authentication.permissions import IsAccountOwnerOrAdmin
from authentication.models import Account
from authentication.serializers import AccountSerializer

from Crypto.Cipher import AES
import binascii


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwnerOrAdmin(),)
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            password = request.data.get('password', None)
            if password is None:
                return Response({'password': 'this field is required'}, status=status.HTTP_400_BAD_REQUEST)

            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        data = request.data
        p = data.get('password', None)
        cp = data.get('confirm_password', None)
        if p != cp:
            return Response('Password and confirm password must march.', status=status.HTTP_400_BAD_REQUEST)
        return super(AccountViewSet, self).update(request, *args, **kwargs)


class LoginView(views.APIView):
    # def pad_str(self, in_string):
    #     in_len = len(in_string)
    #     pad_size = 16 - (in_len % 16)
    #     return in_string.ljust(in_len + pad_size, chr(pad_size))
    #
    def post(self, request, format=None):
        data = request.data

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                # key = binascii.a2b_hex('01ab38d5e05c92aa098921d9d4626107133c7e2ab0e4849558921ebcc242bcb0')
                # iv = binascii.a2b_hex('45654326565437624565432656543762')
                #
                # obj = AES.new(key, AES.MODE_CFB, iv, segment_size=128)
                # data = json.dumps(serialized.data)
                # data = self.pad_str(data)
                # # data = unicode(data)
                # print(repr(data))
                # ciphertext = obj.encrypt(data)
                # bc = binascii.b2a_base64(ciphertext)
                #
                # print(repr(obj.decrypt(binascii.a2b_base64(bc))))

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class CheckSession(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        return Response(AccountSerializer(request.user).data)
