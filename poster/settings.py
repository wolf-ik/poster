import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '546avp^nid5g(8khvefp3i!7^6e&q9*@9&0dqezsu!_tl0-)tg'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'social.apps.django_app.default',
    'rest_social_auth',
    'compressor',
    'rest_framework',
    'authentication',
    'post',
    'djangosphinx',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'poster.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'poster.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'poster_db',
        'HOST': 'localhost',
        'USER': 'root',
        'PASSWORD': 'nensia',
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = 'staticfiles'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

COMPRESS_ENABLED = os.environ.get('COMPRESS_ENABLED', False)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    )
}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

AUTH_USER_MODEL = 'authentication.Account'

SPHINX_API_VERSION = 0x116
SPHINX_PORT = 9312
SPHINX_SERVER = '127.0.0.1'

SOCIAL_AUTH_FACEBOOK_KEY = '1667998946784328'
SOCIAL_AUTH_FACEBOOK_SECRET = '7ae1464fe1dcea9a92db0e64b107c00e'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']

SOCIAL_AUTH_TWITTER_KEY = 'xspzddY58kqJi5eYTxtxqdUgY'
SOCIAL_AUTH_TWITTER_SECRET = 'iKYqQ9dVTgtSa7zUryIlxU7hm4z1AbPF7YVy4GRkL2iiMTb8tI'
SOCIAL_AUTH_TWITTER_SCOPE = ['email']

SOCIAL_AUTH_VK_OAUTH2_KEY = '5304589'
SOCIAL_AUTH_VK_OAUTH2_SECRET = 'f6moZ2Q6P6GkDzdwikMX'
SOCIAL_AUTH_VK_OAUTH2_SCOPE = ['email']

AUTHENTICATION_BACKENDS = (
    'social.backends.facebook.FacebookOAuth2',
    'social.backends.twitter.TwitterOAuth',
    'social.backends.vk.VKOAuth2',

    'django.contrib.auth.backends.ModelBackend',
)

# REST_AUTH_SERIALIZERS = {
#     'USER_DETAILS_SERIALIZER': 'authentication.serializers.AccountSerializer',
# }
